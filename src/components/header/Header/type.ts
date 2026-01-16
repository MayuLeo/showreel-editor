import type { ShowreelInfo } from '@/types/showreel';

export type HeaderProps = {
  showreelInfo: ShowreelInfo;
  onNameChange: (name: string) => void;
};
