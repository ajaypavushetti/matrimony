import { useRef, useState, useEffect, useCallback } from 'react';

function PhotoSlider({ photos, name }) {
  const trackRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const getInitials = (n) => {
    if (!n) return '?';
    return n
      .split(' ')
      .map((w) => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleScroll = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const scrollLeft = track.scrollLeft;
    const width = track.offsetWidth;
    const idx = Math.round(scrollLeft / width);
    setActiveIndex(idx);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    track.addEventListener('scroll', handleScroll, { passive: true });
    return () => track.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const scrollToIndex = (idx) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollTo({ left: idx * track.offsetWidth, behavior: 'smooth' });
  };

  if (!photos || photos.length === 0) {
    return (
      <div className="photo-slider">
        <div className="photo-slider-avatar">
          {getInitials(name)}
        </div>
      </div>
    );
  }

  return (
    <div className="photo-slider">
      <div className="photo-slider-track" ref={trackRef}>
        {photos.map((photo, index) => {
          // Photos are objects with {url, publicId}
          const src = typeof photo === 'string' ? photo : photo.url;
          return (
            <div className="photo-slider-slide" key={index}>
              <img src={src} alt={`${name} photo ${index + 1}`} />
            </div>
          );
        })}
      </div>
      {photos.length > 1 && (
        <div className="photo-slider-dots">
          {photos.map((_, index) => (
            <button
              key={index}
              className={`photo-slider-dot ${index === activeIndex ? 'active' : ''}`}
              onClick={() => scrollToIndex(index)}
              aria-label={`Go to photo ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default PhotoSlider;
