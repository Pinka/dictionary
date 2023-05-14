import { type Tag as TagModel } from "@prisma/client";
import React from "react";
import clsx from "clsx";
import { Tag } from "./Tag";

export const Tags: React.FC<{
  className?: string;
  tags?: TagModel[];
  selectedTags?: number[];
  onTagSelect?: (selectedTags: number[]) => void;
}> = ({ className, tags, selectedTags, onTagSelect }) => {
  const onToggleTag = (tag: TagModel) => {
    if (!tags) return;

    if (selectedTags?.some((id) => id === tag.id)) {
      onTagSelect?.(selectedTags.filter((id) => id !== tag.id));
    } else {
      onTagSelect?.([...(selectedTags ?? []), tag.id]);
    }
  };

  return (
    <div className={clsx("flex w-full flex-row gap-2", className)}>
      {tags?.map((tag) => (
        <Tag
          key={tag.id}
          isSelected={selectedTags?.some((id) => id === tag.id) ?? false}
          onClick={onTagSelect ? () => onToggleTag(tag) : undefined}
        >
          {tag.name}
        </Tag>
      ))}
    </div>
  );
};
