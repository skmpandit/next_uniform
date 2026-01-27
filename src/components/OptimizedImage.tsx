type Props = { src: string; alt: string; width?: number; height?: number; srcSet?: string; className?: string; };

export default function OptimizedImage({ src, alt, width, height, srcSet, className }: Props) {
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading="lazy"
      decoding="async"
      srcSet={srcSet}
      className={className}
      style={{ maxWidth: '100%', height: 'auto' }}
    />
  );
}