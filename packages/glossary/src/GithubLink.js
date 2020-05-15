import React from 'react';
import { Github } from 'styled-icons/fa-brands';

const GithubLink = ({ link, text }) => {
  return (
    <a href={link} className="githubSection">
      <Github icon="github" width="16px" />
      {text}
    </a>
  );
};

export default GithubLink;
