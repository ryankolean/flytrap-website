'use client';

// PaintingModal.tsx
// Full-image overlay for a single fly painting.
// Uses <dialog> element; closes on Escape (native) and click-outside.
// Focus is trapped to the close button on open.
// from docs/06-capture-debrief.md (catalog) and plan Task 11.

import Image from 'next/image';
import { useEffect, useRef } from 'react';

export interface ModalPainting {
  _id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  alt?: string;
}

interface PaintingModalProps {
  painting: ModalPainting;
  onClose: () => void;
}

export function PaintingModal({ painting, onClose }: PaintingModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    dialog.showModal();
    closeRef.current?.focus();

    function handleCancel(e: Event) {
      e.preventDefault();
      onClose();
    }

    dialog.addEventListener('cancel', handleCancel);
    return () => {
      dialog.removeEventListener('cancel', handleCancel);
    };
  }, [onClose]);

  function handleBackdropClick(e: React.MouseEvent<HTMLDialogElement>) {
    if (e.target === dialogRef.current) {
      onClose();
    }
  }

  return (
    // Keyboard: Escape is handled natively by <dialog> via the cancel event above.
    // The onClick is backdrop-click detection only — the close button handles keyboard access.
    /* eslint-disable jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/click-events-have-key-events */
    <dialog
      ref={dialogRef}
      onClick={handleBackdropClick}
      className="m-auto max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-lg bg-[color:var(--color-checker-black)] p-0 shadow-2xl backdrop:bg-black/70 open:flex"
    >
      <div className="flex w-full flex-col">
        <div className="flex items-start justify-between gap-4 px-5 py-4">
          <h2 className="font-serif text-xl leading-tight text-[color:var(--color-cream-paper)]">
            {painting.title}
          </h2>
          <button
            ref={closeRef}
            onClick={onClose}
            aria-label="Close painting"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[color:var(--color-cream-paper)]/30 text-[color:var(--color-cream-paper)] transition hover:bg-[color:var(--color-cream-paper)]/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[color:var(--color-marble-gold)]"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>

        {painting.imageUrl ? (
          <div
            className="relative w-full"
            style={{ maxHeight: 'calc(90vh - 8rem)', aspectRatio: '4/3' }}
          >
            <Image
              src={painting.imageUrl}
              alt={painting.alt ?? painting.title}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 768px"
            />
          </div>
        ) : (
          <div
            className="flex aspect-square w-full items-center justify-center bg-[color:var(--color-bar-fog)]"
            aria-hidden="true"
          >
            <span className="font-serif text-6xl text-[color:var(--color-cream-paper)]/20">
              ~
            </span>
          </div>
        )}

        {painting.description && (
          <p className="px-5 py-4 font-sans text-sm leading-relaxed text-[color:var(--color-cream-paper)]/80">
            {painting.description}
          </p>
        )}
      </div>
    </dialog>
  );
}

export default PaintingModal;
