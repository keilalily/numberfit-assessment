export interface QuestionData {
  img_src: string;
  age_group: string[];
  question: string;
  responseType: 'multipleChoice';
  choices: string[];
  hint: string;
  answer: string[];
  pointsRewarded: number[];
  endpoint?: string;
}