import { useState, useEffect, useRef, ChangeEvent } from "react";
import {
  FileText,
  Image,
  Upload,
  Grid3X3,
  List,
  Search,
  Download,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { filesService, FileItem } from "@/lib/files";
import { API } from "@/api";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Backend URL for downloads (assuming dev env, ideally get from env)
const BACKEND_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/api\/?$/, "");

export default function Files() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [fileToDelete, setFileToDelete] = useState<string | null>(null);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchFiles = async () => {
    try {
      const data = await filesService.getFiles();
      setFiles(data);
    } catch (error) {
      console.error("Failed to load files", error);
      toast({ title: "Error", description: "Could not load files", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleFileUpload = async (file: File) => {
    try {
      toast({ title: "Uploading...", description: "Please wait." });
      await filesService.uploadFile(file);
      toast({ title: "Success", description: "File uploaded successfully." });
      fetchFiles();
    } catch (error) {
      console.error("Upload failed", error);
      toast({ title: "Error", description: "File upload failed.", variant: "destructive" });
    }
  };

  const handleDeleteFile = async () => {
    if (!fileToDelete) return;

    try {
      // Optimistic update
      const previousFiles = [...files];
      setFiles(files.filter(f => f._id !== fileToDelete));
      setFileToDelete(null); // Close dialog immediately

      await filesService.deleteFile(fileToDelete);
      toast({ title: "Deleted", description: "File permanently removed." });
    } catch (error) {
      console.error("Delete failed", error);
      toast({ title: "Error", description: "Failed to delete file.", variant: "destructive" });
      fetchFiles(); // Revert on error
    }
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getDownloadUrl = (path: string) => {
    // If path is absolute or relative, adjust. Assuming relative from backend root 'uploads/'
    // Backend returns "uploads\\filename" on windows sometimes. Normalizing.
    const cleanPath = path.replace(/\\/g, '/');
    return `${BACKEND_URL}/${cleanPath}`;
  };

  const filteredFiles = files.filter(f =>
    f.originalName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Files & Documents</h1>
            <p className="text-muted-foreground">Manage your project assets.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search files..."
                className="pl-9 w-48 lg:w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex bg-secondary/50 rounded-lg p-0.5">
              <Button
                variant={view === "grid" ? "default" : "ghost"}
                size="icon-sm"
                onClick={() => setView("grid")}
                className="h-8 w-8"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={view === "list" ? "default" : "ghost"}
                size="icon-sm"
                onClick={() => setView("list")}
                className="h-8 w-8"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>

            <Button onClick={triggerFileInput} className="ml-2">
              <Upload className="h-4 w-4 mr-2" />
              Upload
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileSelect}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-center py-20">Loading...</div>
      ) : filteredFiles.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed rounded-xl">
          <div className="p-4 rounded-full bg-secondary w-fit mx-auto mb-4">
            <Upload className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium">No files uploaded yet</h3>
          <p className="text-muted-foreground mb-6">Upload your first file to get started</p>
          <Button onClick={triggerFileInput}>Upload File</Button>
        </div>
      ) : (
        <div className={cn(
          view === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
            : "space-y-2"
        )}>
          {filteredFiles.map((file) => (
            <div
              key={file._id}
              className={cn(
                "group relative border rounded-xl p-4 transition-all hover:shadow-md bg-card",
                view === "list" && "flex items-center gap-4 p-3"
              )}
            >
              <div className={cn(
                "rounded-lg flex items-center justify-center shrink-0 bg-primary/10 text-primary",
                view === "grid" ? "w-12 h-12 mb-4" : "w-10 h-10"
              )}>
                {file.mimeType?.startsWith('image') ? <Image className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <h3 className="font-medium truncate pr-4" title={file.originalName}>{file.originalName}</h3>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                  <span>{formatSize(file.size)}</span>
                  <span>•</span>
                  <span>{new Date(file.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className={cn(view === "grid" ? "mt-4 pt-4 border-t flex justify-between items-center" : "flex items-center gap-2")}>

                {view === "grid" ? (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 px-2"
                      onClick={() => setFileToDelete(file._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>

                    <a href={getDownloadUrl(file.path)} target="_blank" rel="noopener noreferrer">
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4 mr-2" /> Download
                      </Button>
                    </a>
                  </>
                ) : (
                  <>
                    <a href={getDownloadUrl(file.path)} target="_blank" rel="noopener noreferrer">
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </a>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => setFileToDelete(file._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </>
                )}

              </div>
            </div>
          ))}
        </div>
      )}

      <AlertDialog open={!!fileToDelete} onOpenChange={(open) => !open && setFileToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete File?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the file.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteFile} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
