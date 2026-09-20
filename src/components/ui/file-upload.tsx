"use client";

import { FileText, Plus, RotateCw, Trash2 } from "lucide-react";
import * as React from "react";
import {
  type Accept,
  type AcceptGroup,
  type DropzoneOptions,
  type FileRejection,
  useDropzone,
} from "react-dropzone";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/cn";

export type FileUploadStatus = "uploading" | "uploaded" | "failed";

/**
 * One row in the upload list. The component owns no transport: the caller
 * starts the upload however it likes and mirrors its state into one of these.
 */
export type FileUploadEntry = {
  /** Stable key. Also the suffix of the row's derived test id. */
  id: string;
  name: string;
  /** Bytes. Formatted with {@link formatFileSize} for the readout. */
  size: number;
  status: FileUploadStatus;
  /** `0`–`100`. Read only while `status` is `"uploading"`. */
  progress?: number;
  /** Seconds remaining. Read only while `status` is `"uploading"`. */
  secondsLeft?: number;
  /** Replaces `failedLabel` on this row alone, for a server-specific reason. */
  error?: string;
};

/**
 * A file that failed a check, straight from react-dropzone: `errors[].code` is
 * one of its `ErrorCode`s (`file-invalid-type`, `file-too-large`,
 * `too-many-files`, …) or whatever a custom `validator` returned.
 */
export type FileUploadRejection = FileRejection;

/**
 * Bytes as a short human readout: `512 B`, `48 KB`, `7.20 MB`, `1.50 GB`.
 * Whole numbers below a megabyte, two decimals above, since that is where
 * the second decimal starts to carry information about an upload.
 */
function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return `${Math.max(0, Math.round(bytes))} B`;
  }
  const kb = bytes / 1024;
  if (kb < 1024) {
    return `${Math.round(kb)} KB`;
  }
  const mb = kb / 1024;
  if (mb < 1024) {
    return `${mb.toFixed(2)} MB`;
  }
  return `${(mb / 1024).toFixed(2)} GB`;
}

/** Every extension an `accept` map (or group list) names, deduped, in order. */
function acceptExtensions(accept?: Accept | AcceptGroup[]): string[] {
  if (!accept) {
    return [];
  }
  const maps = Array.isArray(accept) ? accept.map((g) => g.accept) : [accept];
  const out: string[] = [];
  for (const map of maps) {
    for (const value of Object.values(map)) {
      for (const ext of typeof value === "string" ? [value] : value) {
        if (!out.includes(ext)) {
          out.push(ext);
        }
      }
    }
  }
  return out;
}

/** Sentence for the dropzone's second line, from the constraints it enforces. */
function describeConstraints(
  accept?: Accept | AcceptGroup[],
  maxSize?: number,
): string {
  const types = acceptExtensions(accept).join(", ");
  const size = maxSize !== undefined ? `${formatFileSize(maxSize)} max` : "";
  if (types && size) {
    return `${types} (${size})`;
  }
  return types || size;
}

/**
 * The drop target on its own: a dashed well over react-dropzone's
 * `useDropzone`. Click or keyboard opens the native picker; a drag over it
 * highlights (and tints red when every dragged item is already known to be
 * the wrong type); a paste with files counts as a drop. Every incoming file
 * is checked against `accept`, `maxSize` and `maxFiles`, then the survivors
 * go to `onFilesAdded` and the rest to `onFilesRejected`. Nothing is uploaded
 * here — that is the caller's job once it has the `File`s.
 *
 * {@link FileUpload} renders this above its list; reach for it directly when
 * the list lives somewhere else (a table, a sidebar) or there is no list.
 *
 * @param props.accept - react-dropzone's map of MIME type to extensions:
 *   `{ "text/csv": [".csv"], "application/vnd.ms-excel": [".xls"] }`. Both
 *   halves are checked, and the picker is pre-filtered with the same list.
 *   Omit to accept anything.
 * @param props.maxSize - Largest file allowed, in bytes. Larger files are
 *   rejected with code `file-too-large`.
 * @param props.maxFiles - Most files one drop or pick may contain. Past it
 *   the whole batch is rejected with `too-many-files` — that is react-dropzone's
 *   rule, not a running total; cap the total in `onFilesAdded` if you need one.
 * @param props.multiple - Let the picker select several at once. Default on.
 * @param props.onFilesAdded - The files that passed every check. Not called
 *   for an empty batch.
 * @param props.onFilesRejected - The files that did not, each with its
 *   errors. Not called when nothing was rejected.
 * @param props.dropzoneOptions - Anything else for `useDropzone`: a custom
 *   `validator`, `minSize`, `noPaste`, `getErrorMessage` for localised error
 *   text, and so on. The props above win where the two overlap.
 * @param props.title - First line of copy. English by default.
 * @param props.hint - Second line. Defaults to a sentence built from
 *   `accept` and `maxSize` (`.csv, .xls (20.00 MB max)`); pass your own to
 *   translate it or to say something else.
 * @param props.className - Extra classes merged onto the well.
 */
function FileUploadDropzone({
  className,
  accept,
  maxSize,
  maxFiles,
  multiple = true,
  disabled,
  onFilesAdded,
  onFilesRejected,
  dropzoneOptions,
  title = "Click or drag files to upload",
  hint = describeConstraints(accept, maxSize),
  "data-testid": testId,
  ...props
}: Omit<React.ComponentProps<"div">, "children"> & {
  accept?: Accept | AcceptGroup[];
  maxSize?: number;
  maxFiles?: number;
  multiple?: boolean;
  disabled?: boolean;
  onFilesAdded?: (files: File[]) => void;
  onFilesRejected?: (rejections: FileUploadRejection[]) => void;
  dropzoneOptions?: Omit<
    DropzoneOptions,
    | "accept"
    | "maxSize"
    | "maxFiles"
    | "multiple"
    | "disabled"
    | "onDrop"
    | "onDropAccepted"
    | "onDropRejected"
  >;
  title?: string;
  hint?: string;
  /** Lands on the well. The file input inside derives `${testId}-input`. */
  "data-testid"?: string;
}) {
  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      ...dropzoneOptions,
      accept,
      maxSize,
      maxFiles,
      multiple,
      disabled,
      onDrop: (accepted, rejected) => {
        if (accepted.length > 0) {
          onFilesAdded?.(accepted);
        }
        if (rejected.length > 0) {
          onFilesRejected?.(rejected);
        }
      },
    });

  return (
    <div
      {...getRootProps({
        ...props,
        className: cn(
          "flex w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-app-border-accent bg-app-bg px-4 py-6 text-center transition-colors duration-200 outline-none select-none",
          "hover:bg-app-hover focus-visible:border-app-accent focus-visible:ring-3 focus-visible:ring-app-accent/30",
          "data-dragging:border-app-accent data-dragging:bg-app-accent-faint",
          "data-drag-reject:border-app-error data-drag-reject:bg-app-error/10",
          "data-disabled:pointer-events-none data-disabled:opacity-50",
          className,
        ),
      })}
      data-slot="file-upload-dropzone"
      data-testid={testId}
      data-dragging={isDragActive || undefined}
      data-drag-reject={isDragReject || undefined}
      data-disabled={disabled || undefined}
    >
      <input
        {...getInputProps()}
        data-slot="file-upload-input"
        data-testid={testId ? `${testId}-input` : undefined}
      />
      <span
        data-slot="file-upload-icon"
        aria-hidden
        className="flex size-14 items-center justify-center rounded-full bg-app-hover text-app-bright"
      >
        <Plus size={24} />
      </span>
      <span data-slot="file-upload-copy" className="flex flex-col gap-1">
        <span
          data-slot="file-upload-title"
          className="font-title text-[13px] font-semibold text-app-bright"
        >
          {title}
        </span>
        {hint && (
          <span
            data-slot="file-upload-hint"
            className="font-description text-[11px] leading-snug text-app-dim"
          >
            {hint}
          </span>
        )}
      </span>
    </div>
  );
}

/**
 * One file's row: a document glyph, name, a status line and the actions the
 * status allows. Uploading rows carry a {@link Progress} bar and a remove
 * button; uploaded rows a remove button; failed rows a retry button beside it
 * and their status line in the error tone.
 *
 * @param props.entry - The row's state. See {@link FileUploadEntry}.
 * @param props.onRemove - Called with the entry when its trash button is
 *   pressed. Omit it and the button does not render.
 * @param props.onRetry - Called with the entry when a failed row's retry
 *   button is pressed. Omit it and the button does not render.
 * @param props.formatTimeLeft - Turns `secondsLeft` into the readout's last
 *   segment. Default `"24 sec left"`.
 * @param props.className - Extra classes merged onto the row.
 */
function FileUploadItem({
  className,
  entry,
  onRemove,
  onRetry,
  removeLabel = "Remove",
  retryLabel = "Retry",
  uploadedLabel = "Uploaded",
  failedLabel = "Upload failed",
  formatTimeLeft = (seconds) => `${Math.max(0, Math.round(seconds))} sec left`,
  "data-testid": testId,
  ...props
}: Omit<React.ComponentProps<"div">, "children"> & {
  entry: FileUploadEntry;
  onRemove?: (entry: FileUploadEntry) => void;
  onRetry?: (entry: FileUploadEntry) => void;
  /** Accessible name for the trash button. English by default. */
  removeLabel?: string;
  /** Accessible name for the retry button. English by default. */
  retryLabel?: string;
  /** Status text for a finished row. English by default. */
  uploadedLabel?: string;
  /** Status text for a failed row without its own `error`. English by default. */
  failedLabel?: string;
  formatTimeLeft?: (seconds: number) => string;
  /**
   * Lands on the row. The buttons derive `${testId}-remove-button` and
   * `${testId}-retry-button`.
   */
  "data-testid"?: string;
}) {
  const uploading = entry.status === "uploading";
  const failed = entry.status === "failed";
  const progress = Math.min(Math.max(entry.progress ?? 0, 0), 100);

  let meta: string;
  if (failed) {
    meta = entry.error ?? failedLabel;
  } else if (uploading) {
    meta = [
      formatFileSize(entry.size),
      `${Math.round(progress)}%`,
      entry.secondsLeft !== undefined ? formatTimeLeft(entry.secondsLeft) : "",
    ]
      .filter(Boolean)
      .join(" · ");
  } else {
    meta = `${formatFileSize(entry.size)} · ${uploadedLabel}`;
  }

  return (
    <div
      data-slot="file-upload-item"
      data-testid={testId}
      data-status={entry.status}
      className={cn(
        "relative flex flex-col gap-2 overflow-hidden rounded-lg border border-app-border-mid bg-app-panel px-3 py-2.5",
        className,
      )}
      {...props}
    >
      <div data-slot="file-upload-item-row" className="flex items-center gap-3">
        <span
          data-slot="file-upload-item-icon"
          aria-hidden
          className="flex size-9 shrink-0 items-center justify-center rounded-md bg-app-accent-faint text-app-accent"
        >
          <FileText size={18} />
        </span>
        <span
          data-slot="file-upload-item-body"
          className="flex min-w-0 flex-1 flex-col gap-0.5"
        >
          <span
            data-slot="file-upload-item-name"
            className="truncate font-title text-[13px] font-semibold text-app-bright"
          >
            {entry.name}
          </span>
          <span
            data-slot="file-upload-item-meta"
            className={cn(
              "truncate font-description text-[11px] leading-snug text-app-dim",
              failed && "text-app-error",
            )}
          >
            {meta}
          </span>
        </span>
        <span
          data-slot="file-upload-item-actions"
          className="flex shrink-0 items-center gap-1"
        >
          {failed && onRetry && (
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={retryLabel}
              data-testid={testId ? `${testId}-retry-button` : undefined}
              onClick={() => onRetry(entry)}
            >
              <RotateCw />
            </Button>
          )}
          {onRemove && (
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={removeLabel}
              data-testid={testId ? `${testId}-remove-button` : undefined}
              className="hover:text-app-error"
              onClick={() => onRemove(entry)}
            >
              <Trash2 />
            </Button>
          )}
        </span>
      </div>
      {uploading && (
        <Progress
          size="sm"
          value={progress}
          aria-label={entry.name}
          data-slot="file-upload-item-progress"
        />
      )}
    </div>
  );
}

/**
 * A file picker with its own upload list: {@link FileUploadDropzone} on top,
 * one {@link FileUploadItem} per entry below. Says which files it takes and
 * how big they may be, and enforces both before the caller ever sees a
 * `File`.
 *
 * Fully controlled and transport-agnostic. It never uploads anything: on
 * `onFilesAdded` the caller starts its own request (fetch, XHR, tus, S3
 * pre-signed PUT — whatever the app does) and keeps `files` in step with it.
 * Each entry's `status`, `progress` and `secondsLeft` are what the list
 * draws; `onRemove` and `onRetry` are just callbacks with the entry, since
 * whether "remove" means abort, delete-from-server or drop-from-state is
 * an application question.
 *
 * Rejections are reported, not rendered. Show them however the surrounding
 * form shows its errors (a toast, a field message) — a library-owned banner
 * would never match.
 *
 * @param props.files - The rows to draw, in order. See {@link FileUploadEntry}.
 * @param props.accept - react-dropzone's MIME-to-extensions map:
 *   `{ "text/csv": [".csv"], "application/vnd.ms-excel": [".xls"] }`. Omit
 *   to accept anything.
 * @param props.maxSize - Largest file allowed, in bytes.
 * @param props.maxFiles - Most files one drop or pick may contain.
 * @param props.multiple - Let the picker choose several at once. Default on.
 * @param props.onFilesAdded - Valid new files; start uploading them.
 * @param props.onFilesRejected - Files that failed a check, each with why.
 * @param props.onRemove - The row's trash button. Omit to hide it.
 * @param props.onRetry - A failed row's retry button. Omit to hide it.
 * @param props.title - Dropzone headline. English by default.
 * @param props.hint - Dropzone second line. Built from `accept` and `maxSize`
 *   unless supplied.
 * @param props.dropzoneOptions - Anything else for `useDropzone` (a
 *   `validator`, `getErrorMessage`, …).
 * @param props.dropzoneProps - Anything else for the dropzone well itself.
 * @param props.className - Extra classes merged onto the outer column.
 *
 * @example
 * ```tsx
 * <FileUpload
 *   accept={{ "text/csv": [".csv"], "application/vnd.ms-excel": [".xls"] }}
 *   maxSize={20 * 1024 * 1024}
 *   files={uploads}
 *   onFilesAdded={(files) => files.forEach(startUpload)}
 *   onFilesRejected={(r) => toast.error(r[0].errors[0].message)}
 *   onRemove={(entry) => abort(entry.id)}
 *   onRetry={(entry) => startUpload(originals.get(entry.id))}
 * />
 * ```
 */
function FileUpload({
  className,
  files = [],
  accept,
  maxSize,
  maxFiles,
  multiple,
  disabled,
  onFilesAdded,
  onFilesRejected,
  onRemove,
  onRetry,
  title,
  hint,
  removeLabel,
  retryLabel,
  uploadedLabel,
  failedLabel,
  formatTimeLeft,
  dropzoneOptions,
  dropzoneProps,
  "data-testid": testId,
  ...props
}: Omit<React.ComponentProps<"div">, "children"> & {
  files?: FileUploadEntry[];
  accept?: Accept | AcceptGroup[];
  maxSize?: number;
  maxFiles?: number;
  multiple?: boolean;
  disabled?: boolean;
  onFilesAdded?: (files: File[]) => void;
  onFilesRejected?: (rejections: FileUploadRejection[]) => void;
  onRemove?: (entry: FileUploadEntry) => void;
  onRetry?: (entry: FileUploadEntry) => void;
  title?: string;
  hint?: string;
  removeLabel?: string;
  retryLabel?: string;
  uploadedLabel?: string;
  failedLabel?: string;
  formatTimeLeft?: (seconds: number) => string;
  dropzoneOptions?: React.ComponentProps<
    typeof FileUploadDropzone
  >["dropzoneOptions"];
  dropzoneProps?: Omit<
    React.ComponentProps<typeof FileUploadDropzone>,
    | "accept"
    | "maxSize"
    | "maxFiles"
    | "multiple"
    | "disabled"
    | "onFilesAdded"
    | "onFilesRejected"
    | "dropzoneOptions"
    | "title"
    | "hint"
    | "data-testid"
  >;
  /**
   * Lands on the column. The dropzone derives `${testId}-dropzone` and each
   * row `${testId}-item-<entry.id>`.
   */
  "data-testid"?: string;
}) {
  return (
    <div
      data-slot="file-upload"
      data-testid={testId}
      className={cn("flex w-full flex-col gap-3", className)}
      {...props}
    >
      <FileUploadDropzone
        {...dropzoneProps}
        accept={accept}
        maxSize={maxSize}
        maxFiles={maxFiles}
        multiple={multiple}
        disabled={disabled}
        onFilesAdded={onFilesAdded}
        onFilesRejected={onFilesRejected}
        dropzoneOptions={dropzoneOptions}
        title={title}
        hint={hint}
        data-testid={testId ? `${testId}-dropzone` : undefined}
      />
      {files.length > 0 && (
        <ul data-slot="file-upload-list" className="flex flex-col gap-2">
          {files.map((entry) => (
            <li key={entry.id} data-slot="file-upload-list-item">
              <FileUploadItem
                entry={entry}
                onRemove={onRemove}
                onRetry={onRetry}
                removeLabel={removeLabel}
                retryLabel={retryLabel}
                uploadedLabel={uploadedLabel}
                failedLabel={failedLabel}
                formatTimeLeft={formatTimeLeft}
                data-testid={testId ? `${testId}-item-${entry.id}` : undefined}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export { FileUpload, FileUploadDropzone, FileUploadItem, formatFileSize };
