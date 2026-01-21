import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { useState } from 'react';
import type { HeaderBarProps } from './type';

export function HeaderBar({ name, onNameChange }: HeaderBarProps) {
  const [editedName, setEditedName] = useState(name);
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    onNameChange(editedName);
    setIsEditing(false);
  };

  const handleReset = () => {
    setEditedName(name);
    setIsEditing(false);
  };

  return (
    <div className="flex items-center gap-4">
      <div className="flex-1">
        <Label htmlFor="showreel-name" className="text-sm font-medium">
          ショーリール名
        </Label>
        <div className="flex items-center gap-2 mt-1">
          {isEditing ? (
            <>
              <Input
                id="showreel-name"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className="flex-1"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSave();
                  if (e.key === 'Escape') handleReset();
                }}
              />
              <Button size="sm" onClick={handleSave}>
                保存
              </Button>
              <Button size="sm" variant="outline" onClick={handleReset}>
                キャンセル
              </Button>
            </>
          ) : (
            <>
              <div className="flex-1 text-lg font-semibold">{name}</div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsEditing(true)}
              >
                リール名を変更
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
