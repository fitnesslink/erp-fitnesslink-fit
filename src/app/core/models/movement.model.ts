export interface MovementListView {
  id: string;
  name: string;
  code: string;
  status: string;
  contributorCompany?: string;
  contributorUser?: string;
  totalUsers: number;
  workoutSessions: number;
  description?: string;
}

export interface MovementDetail {
  id: string;
  name: string;
  description?: string;
  statusName: string;
  videoId?: string;
  contributorName?: string;
  imageId?: string;
  thumbnailId?: string;
}

export interface CreateMovementDto {
  name: string;
  description?: string;
  videoId?: string;
  statusId: string;
  contributorId?: string;
  imageId?: string;
  thumbnailId?: string;
}

export interface UpdateMovementDto {
  name?: string;
  description?: string;
  statusId?: string;
}
