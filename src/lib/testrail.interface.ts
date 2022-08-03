export interface TestRailOptions {
  host: string;
  username: string;
  password: string;
  projectId: number;
  suiteId: number;
  runName: string;
  /**
   * Whether to group all results into a single Testrail run.
   * If not, a run will be created for every test file
   */
  singleRun?: boolean;
  /**
   * Disable the Testrail Description field being filled with cypress urls
   */
  disableDescription?: boolean;
  allowFailedScreenshotUpload?: boolean;
  assignedToId?: number;
  includeAllInTestRun?: boolean;
  groupId?: number;
  filter?: string;
  typeId?: number;
}

export enum Status {
  Passed = 1,
  Blocked = 2,
  Untested = 3,
  Retest = 4,
  Failed = 5,
}

export interface TestRailResult {
  case_id: number;
  status_id: Status;
  comment?: string;
}

export interface TestRailCase {
  id: number;
  title: string;
  section_id: number;
  template_id: number;
  type_id: number;
  priority_id: number;
  milestone_id?: number;
  refs?: string;
  created_by: number;
  created_on: number;
  updated_by: number;
  updated_on: number;
  estimate?: string;
  estimate_forecast?: string;
  suite_id: number;
  custom_preconds?: string;
  custom_steps?: string;
  custom_expected?: string;
  custom_steps_separated?: string;
  custom_mission?: string;
  custom_goals?: string;
}
