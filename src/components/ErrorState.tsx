import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@corbinmurray/ui-components";
import { AlertCircle } from "lucide-react";

interface ErrorStateProps {
  title?: string;
  message: string;
}

export function ErrorState({ title = "Error", message }: ErrorStateProps) {
  return (
    <Alert variant="destructive">
      <AlertCircle className="size-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}
