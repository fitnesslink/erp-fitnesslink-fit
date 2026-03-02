export interface ProgramListItem {
  id: string;
  name: string;
  description?: string;
  estimatedTime?: number;
  statusName: string;
  contributorName?: string;
}

export interface ProgramDetail {
  id: string;
  name: string;
  description?: string;
  estimatedTime?: number;
  statusName: string;
  contributorName?: string;
  imageId?: string;
  thumbnailId?: string;
}

export interface CreateProgramDto {
  name: string;
  description?: string;
  estimatedTime?: number;
  statusId: string;
  contributorId?: string;
  imageId?: string;
  thumbnailId?: string;
}

export interface UpdateProgramDto {
  name?: string;
  description?: string;
  statusId?: string;
  estimatedTime?: number;
}
