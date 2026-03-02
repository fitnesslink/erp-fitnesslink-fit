export interface WorkoutListItem {
  id: string;
  name: string;
  description?: string;
  estimatedTime: number;
  statusName: string;
  contributorName?: string;
  imageId?: string;
  thumbnailId?: string;
}

export interface WorkoutDetail {
  id: string;
  name: string;
  description?: string;
  estimatedTime: number;
  statusName: string;
  contributorName?: string;
  imageId?: string;
  thumbnailId?: string;
}

export interface CreateWorkoutDto {
  name: string;
  description?: string;
  statusId: string;
  estimatedTime: number;
  contributorId?: string;
  imageId?: string;
  thumbnailId?: string;
}

export interface UpdateWorkoutDto {
  name?: string;
  description?: string;
  statusId?: string;
  estimatedTime?: number;
}
