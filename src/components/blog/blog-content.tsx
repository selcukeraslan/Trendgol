/** Düz metin blog içeriğini paragraflara bölerek gösterir. */
export function BlogContent({ content }: { content: string }) {
  const paragraphs = content
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  return (
    <div className="space-y-4 text-pretty leading-relaxed text-muted-foreground">
      {paragraphs.map((paragraph, index) => (
        <p key={index}>{paragraph}</p>
      ))}
    </div>
  );
}
