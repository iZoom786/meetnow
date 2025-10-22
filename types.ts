
export interface Summary {
  summary: string;
  highlights: string[];
  actionItems: string[];
}

export interface Meeting {
  id: string;
  title: string;
  date: string;
  transcript: string;
  summary: Summary | null;
}

export interface Folder {
  id: string;
  name: string;
  meetings: Meeting[];
}

export interface Workspace {
  id: string;
  name: string;
  folders: Folder[];
}

export enum AppView {
  FOLDER,
  MEETING,
  SUMMARY,
  SETTINGS,
}
