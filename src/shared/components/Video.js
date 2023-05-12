import React from 'react';

const YouTube = ({ url, title }) => {
  if (!url) {
    return <p style={{ textAlign: 'center', color: 'red' }}>Error: No YouTube URL provided.</p>;
  }

  const embedURL = `${url}`;

  return (
    <div
      style={{
        textAlign: 'center',
        padding: '1em',
        position: 'relative',
        width: '100%',
        height: 0,
        paddingBottom: '56.25%',
      }}
    >
      <iframe
        src={embedURL}
        width="560"
        height="315"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}
        allowFullScreen
        title={title || 'YouTube Video'}
      ></iframe>
    </div>
  );
};

export default YouTube;
