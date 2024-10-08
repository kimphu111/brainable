export interface Question {
  id: string;
  question: string;
  answer: number;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  imgUrl: string;
  timeLimit: number;
}

export interface QuestionDTO {
  question: string;
  answer: number;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  imgUrl: string;
  timeLimit: number;
}
