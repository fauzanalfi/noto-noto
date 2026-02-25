import { useState, useCallback } from 'react';

export default function TagManager({
  tags,
  onAddTag,
  onRemoveTag,
}) {
  const [tagInput, setTagInput] = useState('');

  const handleAddTag = useCallback(() => {
    if (tagInput.trim()) {
      onAddTag(tagInput.trim().toLowerCase().replace(/\s+/g, '-'));
      setTagInput('');
    }
  }, [tagInput, onAddTag]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <div className="editor-tags-area">
      {tags.map((tag) => (
        <span key={tag} className="editor-tag">
          #{tag}
          <button onClick={() => onRemoveTag(tag)}>×</button>
        </span>
      ))}
      <input
        className="tag-add-input"
        value={tagInput}
        onChange={(e) => setTagInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="+ tag"
      />
    </div>
  );
}
