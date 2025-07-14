import type React from 'react';
import { useState, useRef, useEffect, useCallback } from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type SwipeAction = {
  label: string;
  onClick: () => void;
  className?: string;
  icon?: React.ReactNode;
};

type SwipeableTransactionProps = {
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  onEdit: () => void;
  onDelete: () => void;
};

// Global state to track open items
let openItemId: string | null = null;
const openItemCallbacks = new Set<(id: string | null) => void>();

export function SwipeableTransaction({
  onClick,
  children,
  className = '',
  onEdit,
  onDelete,
}: SwipeableTransactionProps) {
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [openDirection, setOpenDirection] = useState<'left' | 'right' | null>(null);

  const itemRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef(0);
  const startTimeRef = useRef(0);
  const hasDraggedRef = useRef(false);
  const itemId = useRef(`swipe-item-${Math.random().toString(36).substr(2, 9)}`);

  const SWIPE_THRESHOLD = 60;
  const TAP_THRESHOLD = 10;
  const TAP_TIME_THRESHOLD = 300;

  // Define actions - Edit on left swipe, Delete on right swipe
  const leftActions: SwipeAction[] = [
    {
      label: 'Edit',
      onClick: onEdit,
      className: 'bg-blue-500 hover:bg-blue-600',
      icon: <Edit className="h-4 w-4" />,
    },
  ];

  const rightActions: SwipeAction[] = [
    {
      label: 'Delete',
      onClick: onDelete,
      className: 'bg-red-500 hover:bg-red-600',
      icon: <Trash2 className="h-4 w-4" />,
    },
  ];

  // Subscribe to global open state changes
  useEffect(() => {
    const callback = (id: string | null) => {
      if (id !== itemId.current && isOpen) {
        closeItem();
      }
    };

    openItemCallbacks.add(callback);
    return () => {
      openItemCallbacks.delete(callback);
    };
  }, [isOpen]);

  const notifyItemOpened = useCallback((id: string) => {
    openItemId = id;
    openItemCallbacks.forEach((callback) => callback(id));
  }, []);

  const closeItem = useCallback(() => {
    setDragX(0);
    setIsOpen(false);
    setOpenDirection(null);
    if (openItemId === itemId.current) {
      openItemId = null;
    }
  }, []);

  const openItem = useCallback(
    (direction: 'left' | 'right', distance: number) => {
      setDragX(distance);
      setIsOpen(true);
      setOpenDirection(direction);
      notifyItemOpened(itemId.current);
    },
    [notifyItemOpened],
  );

  const handleStart = (clientX: number) => {
    startXRef.current = clientX;
    startTimeRef.current = Date.now();
    hasDraggedRef.current = false;
    setIsDragging(true);
  };

  const handleMove = (clientX: number) => {
    if (!isDragging) return;

    const deltaX = clientX - startXRef.current;
    const absDeltaX = Math.abs(deltaX);

    if (absDeltaX > TAP_THRESHOLD) {
      hasDraggedRef.current = true;
    }

    // Only allow dragging if we have actions in that direction
    if (deltaX > 0 && leftActions.length === 0) return;
    if (deltaX < 0 && rightActions.length === 0) return;

    // Limit drag distance with rubber band effect
    const maxDrag = 120;
    let limitedDeltaX = deltaX;

    if (Math.abs(deltaX) > maxDrag) {
      const excess = Math.abs(deltaX) - maxDrag;
      const rubberBand = Math.log(excess / 50 + 1) * 20;
      limitedDeltaX = deltaX > 0 ? maxDrag + rubberBand : -(maxDrag + rubberBand);
    }

    setDragX(limitedDeltaX);
  };

  const handleEnd = () => {
    setIsDragging(false);

    const deltaX = dragX;
    const absDeltaX = Math.abs(deltaX);
    const timeDelta = Date.now() - startTimeRef.current;

    // Handle tap vs swipe detection
    if (!hasDraggedRef.current && timeDelta < TAP_TIME_THRESHOLD && onClick) {
      onClick();
      setDragX(0);
      return;
    }

    // Handle swipe actions
    if (absDeltaX >= SWIPE_THRESHOLD) {
      if (deltaX > 0 && leftActions.length > 0) {
        // Swipe right - show left actions (Edit)
        openItem('left', 100);
      } else if (deltaX < 0 && rightActions.length > 0) {
        // Swipe left - show right actions (Delete)
        openItem('right', -100);
      } else {
        setDragX(0);
      }
    } else {
      // Snap back
      setDragX(0);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    handleStart(e.clientX);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    handleStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    // e.preventDefault();
    handleMove(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (isOpen) {
      closeItem();
    } else {
      handleEnd();
    }
  };

  // Handle mouse events globally when dragging
  useEffect(() => {
    if (isDragging) {
      const handleGlobalMouseMove = (e: MouseEvent) => {
        handleMove(e.clientX);
      };

      document.addEventListener('mousemove', handleGlobalMouseMove);

      return () => {
        document.removeEventListener('mousemove', handleGlobalMouseMove);
      };
    }
  }, [isDragging]);

  // Click outside to close
  useEffect(() => {
    if (isOpen) {
      const handleClickOutside = (e: MouseEvent) => {
        if (itemRef.current && !itemRef.current.contains(e.target as Node)) {
          closeItem();
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, closeItem]);

  const renderActions = (actions: SwipeAction[], side: 'left' | 'right') => {
    return actions.map((action, index) => (
      <button
        key={index}
        onClick={(e) => {
          e.stopPropagation();
          action.onClick();
          closeItem();
        }}
        className={`flex h-full min-w-[80px] flex-col items-center justify-center space-y-1 px-6 py-2 text-sm font-medium text-white transition-colors ${
          action.className || (side === 'left' ? 'bg-blue-500 hover:bg-blue-600' : 'bg-red-500 hover:bg-red-600')
        } ${index === 0 && side === 'left' ? 'rounded-l-lg' : ''} ${
          index === actions.length - 1 && side === 'right' ? 'rounded-r-lg' : ''
        } `}
      >
        {action.icon}
        <span className="text-xs">{action.label}</span>
      </button>
    ));
  };

  return (
    <div className={cn('relative overflow-hidden rounded-lg', className)} ref={itemRef}>
      {/* Left Actions (Edit) */}
      {leftActions.length > 0 && (
        <div
          className="absolute top-0 left-0 z-10 flex h-full items-center"
          style={{
            transform: `translateX(${Math.min(-100 + (isOpen && openDirection === 'left' ? 100 : 0), 0)}px)`,
            transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          {renderActions(leftActions, 'left')}
        </div>
      )}

      {/* Right Actions (Delete) */}
      {rightActions.length > 0 && (
        <div
          className="absolute top-0 right-0 z-10 flex h-full items-center"
          style={{
            transform: `translateX(${Math.max(100 - (isOpen && openDirection === 'right' ? 100 : 0), 0)}px)`,
            transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          {renderActions(rightActions, 'right')}
        </div>
      )}

      {/* Main Content */}
      <div
        className="relative z-20 cursor-pointer bg-white select-none dark:bg-slate-800"
        style={{
          transform: `translateX(${dragX}px)`,
          transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {children}
      </div>
    </div>
  );
}
