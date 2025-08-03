import { useState, useRef, useCallback, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useMediaQuery } from '@/hooks/use-media-query';
import transactionUtils from '@/lib/transaction-utils';
import { DynamicIcon } from '@/components/lucide';

interface Attachment {
  name: string;
  url: string;
  type: string;
  size: string;
}

interface AttachmentViewerProps {
  isOpen: boolean;
  onClose: () => void;
  attachment: Attachment | null;
}

const AttachmentViewer = ({ isOpen, onClose, attachment }: AttachmentViewerProps) => {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const [isDownloading, setIsDownloading] = useState(false);

  // Zoom and pan state
  const [scale, setScale] = useState(1);
  const [translateX, setTranslateX] = useState(0);
  const [translateY, setTranslateY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // Refs
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastTouchRef = useRef<{ x: number; y: number; distance: number } | null>(null);
  const dragStartRef = useRef<{ x: number; y: number; translateX: number; translateY: number } | null>(null);

  // Reset zoom when attachment changes
  useEffect(() => {
    setScale(1);
    setTranslateX(0);
    setTranslateY(0);
    setIsDragging(false);
  }, [attachment?.url]);

  const handleDownload = async () => {
    if (!attachment?.url) return;

    setIsDownloading(true);

    try {
      // Fetch the file as a blob
      const response = await fetch(attachment.url);

      if (!response.ok) {
        throw new Error(`Failed to fetch file: ${response.status}`);
      }

      const blob = await response.blob();

      // Create a temporary URL for the blob
      const blobUrl = window.URL.createObjectURL(blob);

      // Create download link
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = attachment.name;

      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up the blob URL
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Download failed:', error);
      // Fallback to simple download method
      const link = document.createElement('a');
      link.href = attachment.url;
      link.download = attachment.name;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } finally {
      setIsDownloading(false);
    }
  };

  // Zoom functions
  const handleZoom = useCallback(
    (newScale: number, centerX?: number, centerY?: number) => {
      const minScale = 0.5;
      const maxScale = 5;
      const clampedScale = Math.max(minScale, Math.min(maxScale, newScale));

      if (centerX !== undefined && centerY !== undefined && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const containerCenterX = rect.width / 2;
        const containerCenterY = rect.height / 2;

        // Calculate new translate values to zoom towards the center point
        const deltaX = (centerX - containerCenterX) * (clampedScale / scale - 1);
        const deltaY = (centerY - containerCenterY) * (clampedScale / scale - 1);

        setTranslateX((prev) => prev - deltaX);
        setTranslateY((prev) => prev - deltaY);
      }

      setScale(clampedScale);
    },
    [scale],
  );

  const handleZoomIn = useCallback(() => {
    handleZoom(scale * 1.5);
  }, [scale, handleZoom]);

  const handleZoomOut = useCallback(() => {
    handleZoom(scale / 1.5);
  }, [scale, handleZoom]);

  const handleResetZoom = useCallback(() => {
    setScale(1);
    setTranslateX(0);
    setTranslateY(0);
  }, []);

  // Add wheel event listener with passive: false
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheelEvent = (e: WheelEvent) => {
      if (attachment?.type !== 'image') return;

      e.preventDefault();
      const rect = container.getBoundingClientRect();
      if (!rect) return;

      const centerX = e.clientX - rect.left;
      const centerY = e.clientY - rect.top;
      const delta = -e.deltaY * 0.01;
      const newScale = scale * (1 + delta);

      handleZoom(newScale, centerX, centerY);
    };

    container.addEventListener('wheel', handleWheelEvent, { passive: false });

    return () => {
      container.removeEventListener('wheel', handleWheelEvent);
    };
  }, [scale, handleZoom, attachment?.type]);

  // Touch events for pinch-to-zoom
  const getTouchDistance = (touches: React.TouchList) => {
    if (touches.length < 2) return 0;
    const touch1 = touches[0];
    const touch2 = touches[1];
    return Math.sqrt(Math.pow(touch2.clientX - touch1.clientX, 2) + Math.pow(touch2.clientY - touch1.clientY, 2));
  };

  const getTouchCenter = (touches: React.TouchList) => {
    if (touches.length < 2) return { x: 0, y: 0 };
    const touch1 = touches[0];
    const touch2 = touches[1];
    return {
      x: (touch1.clientX + touch2.clientX) / 2,
      y: (touch1.clientY + touch2.clientY) / 2,
    };
  };

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (attachment?.type !== 'image') return;

      if (e.touches.length === 2) {
        // Pinch start
        const distance = getTouchDistance(e.touches);
        const center = getTouchCenter(e.touches);
        const rect = containerRef.current?.getBoundingClientRect();
        if (rect) {
          lastTouchRef.current = {
            x: center.x - rect.left,
            y: center.y - rect.top,
            distance,
          };
        }
      } else if (e.touches.length === 1 && scale > 1) {
        // Pan start
        const touch = e.touches[0];
        dragStartRef.current = {
          x: touch.clientX,
          y: touch.clientY,
          translateX,
          translateY,
        };
        setIsDragging(true);
      }
    },
    [attachment?.type, scale, translateX, translateY],
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (attachment?.type !== 'image') return;

      if (e.touches.length === 2 && lastTouchRef.current) {
        // Pinch zoom
        e.preventDefault();
        const distance = getTouchDistance(e.touches);
        const scaleRatio = distance / lastTouchRef.current.distance;
        const newScale = scale * scaleRatio;

        const center = getTouchCenter(e.touches);
        const rect = containerRef.current?.getBoundingClientRect();
        if (rect) {
          const centerX = center.x - rect.left;
          const centerY = center.y - rect.top;
          handleZoom(newScale, centerX, centerY);
        }

        lastTouchRef.current = {
          ...lastTouchRef.current,
          distance,
        };
      } else if (e.touches.length === 1 && isDragging && dragStartRef.current && scale > 1) {
        // Pan
        e.preventDefault();
        const touch = e.touches[0];
        const deltaX = touch.clientX - dragStartRef.current.x;
        const deltaY = touch.clientY - dragStartRef.current.y;

        setTranslateX(dragStartRef.current.translateX + deltaX);
        setTranslateY(dragStartRef.current.translateY + deltaY);
      }
    },
    [attachment?.type, scale, isDragging, handleZoom],
  );

  const handleTouchEnd = useCallback(() => {
    if (attachment?.type !== 'image') return;

    lastTouchRef.current = null;
    dragStartRef.current = null;
    setIsDragging(false);
  }, [attachment?.type]);

  // Mouse events for pan
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (attachment?.type !== 'image' || scale <= 1) return;

      e.preventDefault();
      dragStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        translateX,
        translateY,
      };
      setIsDragging(true);
    },
    [attachment?.type, scale, translateX, translateY],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (attachment?.type !== 'image' || !isDragging || !dragStartRef.current || scale <= 1) return;

      e.preventDefault();
      const deltaX = e.clientX - dragStartRef.current.x;
      const deltaY = e.clientY - dragStartRef.current.y;

      setTranslateX(dragStartRef.current.translateX + deltaX);
      setTranslateY(dragStartRef.current.translateY + deltaY);
    },
    [attachment?.type, isDragging, scale],
  );

  const handleMouseUp = useCallback(() => {
    if (attachment?.type !== 'image') return;

    dragStartRef.current = null;
    setIsDragging(false);
  }, [attachment?.type]);

  // Double-click/tap to zoom
  const handleDoubleClick = useCallback(
    (e: React.MouseEvent) => {
      if (attachment?.type !== 'image') return;

      e.preventDefault();
      if (scale > 1) {
        handleResetZoom();
      } else {
        const rect = containerRef.current?.getBoundingClientRect();
        if (rect) {
          const centerX = e.clientX - rect.left;
          const centerY = e.clientY - rect.top;
          handleZoom(2, centerX, centerY);
        }
      }
    },
    [attachment?.type, scale, handleZoom, handleResetZoom],
  );

  if (!attachment) return null;

  const content = (
    <div className="flex h-full flex-col gap-4">
      {/* Header with title and size */}
      <div className="flex flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-2 flex-1 text-lg font-semibold text-slate-900 dark:text-white">
            {attachment.name}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          {Number(attachment.size) > 0 && (
            <Badge variant="secondary" className="text-xs">
              {transactionUtils.formatFileSize(attachment.size)}
            </Badge>
          )}
          <Badge variant="outline" className="text-xs">
            {attachment.type}
          </Badge>
        </div>
      </div>

      {/* Content Area */}
      <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50">
        {attachment.type === 'image' ? (
          <>
            {/* Zoom Controls */}
            <div className="absolute top-2 right-2 z-10 flex flex-col gap-1 rounded-lg bg-white/90 p-1 shadow-lg backdrop-blur-sm dark:bg-slate-800/90">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={handleZoomIn} disabled={scale >= 5}>
                <DynamicIcon name="zoom-in" className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={handleZoomOut} disabled={scale <= 0.5}>
                <DynamicIcon name="zoom-out" className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={handleResetZoom}
                disabled={scale === 1 && translateX === 0 && translateY === 0}
              >
                <DynamicIcon name="rotate-ccw" className="h-4 w-4" />
              </Button>
            </div>

            {/* Zoom Level Indicator */}
            {scale !== 1 && (
              <div className="absolute top-2 left-2 z-10 rounded-lg bg-white/90 px-2 py-1 text-xs font-medium text-slate-700 shadow-lg backdrop-blur-sm dark:bg-slate-800/90 dark:text-slate-300">
                {Math.round(scale * 100)}%
              </div>
            )}

            {/* Image Container */}
            <div
              ref={containerRef}
              className={`flex h-full w-full items-center justify-center p-4 ${
                scale > 1 ? 'cursor-grab' : 'cursor-pointer'
              } ${isDragging ? 'cursor-grabbing' : ''}`}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onDoubleClick={handleDoubleClick}
            >
              <img
                ref={imageRef}
                src={attachment.url}
                alt={attachment.name}
                className="max-h-full max-w-full rounded object-contain transition-transform duration-100"
                style={{
                  transform: `scale(${scale}) translate(${translateX / scale}px, ${translateY / scale}px)`,
                  maxHeight: '70vh',
                  userSelect: 'none',
                  WebkitUserSelect: 'none',
                  MozUserSelect: 'none',
                  msUserSelect: 'none',
                  pointerEvents: 'none',
                }}
                draggable={false}
              />
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center gap-4 p-8">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700">
              <DynamicIcon name="file-text" className="h-12 w-12 text-slate-600 dark:text-slate-400" />
            </div>
            <div className="text-center">
              <p className="text-sm text-slate-600 dark:text-slate-300">File preview not available</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Click download to view the file</p>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button onClick={handleDownload} disabled={isDownloading} className="flex-1 gap-2">
          {isDownloading ? (
            <>
              <DynamicIcon name="loader-2" className="h-4 w-4 animate-spin" />
              Downloading...
            </>
          ) : (
            <>
              <DynamicIcon name="download" className="h-4 w-4" />
              Download
            </>
          )}
        </Button>
        <Button variant="outline" onClick={onClose} className="flex-1">
          Close
        </Button>
      </div>
    </div>
  );

  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="flex max-h-[90vh] max-w-4xl flex-col">
          <DialogHeader>
            <DialogTitle>Attachment Preview</DialogTitle>
          </DialogHeader>
          <div className="flex min-h-0 flex-1 flex-col px-2">{content}</div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="h-[90%]">
        <DrawerHeader>
          <DrawerTitle>Attachment Preview</DrawerTitle>
        </DrawerHeader>
        <div className="flex min-h-0 flex-1 flex-col px-4 pb-4">{content}</div>
      </DrawerContent>
    </Drawer>
  );
};

export default AttachmentViewer;
