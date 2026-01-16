export interface Message {
  _id: string;            // 必须
  type: string; // 必须
  content: any;           // 必须
  position?: 'left' | 'right';
  user?: {
    avatar?: string;
    name?: string;
  };
}
