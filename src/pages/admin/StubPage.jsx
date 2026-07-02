// ============================================================
// STUB PAGE - Placeholder for unimplemented pages
// ============================================================

export default function StubPage({ title, note }) {
  return (
    <div className="p-8 font-sans">
      <h2 className="text-xl font-normal text-[#1A1A2E] font-serif mb-2">
        {title}
      </h2>
      <p className="text-sm text-[#6B6577] m-0">
        {note || 'This section will be built in a subsequent session.'}
      </p>
    </div>
  );
}
