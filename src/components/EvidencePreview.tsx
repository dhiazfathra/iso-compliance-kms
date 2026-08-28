import type { EvidenceItem } from '@/lib/data'

const OFFICE_HINT: Record<string, string> = {
  XLSX: 'Spreadsheet · open in Excel or Sheets',
  PPTX: 'Presentation · open in PowerPoint or Slides',
  DOCX: 'Document · open in Word or Docs',
}

/**
 * Preview by file type: PDFs render in place, images render inline, and Office
 * formats — which no browser renders natively — get a labelled card with the
 * download link rather than a broken frame.
 */
export function EvidencePreview({ item }: { item: EvidenceItem }) {
  const frame: React.CSSProperties = {
    background: 'var(--panel)',
    border: '1px solid var(--line)',
    height: 440,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
  }

  if (!item.url) {
    return (
      <div style={frame}>
        <span className="mono" style={{ fontSize: 11, color: 'var(--muted)' }}>
          No file stored — upload a version to attach the document
        </span>
      </div>
    )
  }

  if (item.fileType === 'PDF') {
    return (
      <iframe
        src={item.url}
        title={item.title}
        style={{ ...frame, width: '100%', border: '1px solid var(--line)' }}
      />
    )
  }

  if (item.fileType === 'PNG' || item.fileType === 'JPG') {
    return (
      <div style={frame}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.url}
          alt={item.title}
          style={{ maxWidth: '100%', maxHeight: 400, objectFit: 'contain' }}
        />
      </div>
    )
  }

  return (
    <div style={frame}>
      <div
        style={{
          width: 230,
          height: 200,
          background: 'var(--bg)',
          border: '1px solid var(--line-strong)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          font: '500 26px var(--mono)',
          color: 'var(--muted)',
        }}
      >
        {item.fileType}
      </div>
      <span className="mono" style={{ fontSize: 11, color: 'var(--muted)' }}>
        {OFFICE_HINT[item.fileType] ?? 'Binary record'}
      </span>
      <a href={item.url} className="mono" style={{ fontSize: 11.5 }} download>
        Download to view
      </a>
    </div>
  )
}
