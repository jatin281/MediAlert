export interface UserData {
    id: string;
    name: string;
    image?: string;
  }
  
  export interface Medicine {
    id: string;
    name: string;
  }
  
  export interface NextMedicineAlert {
    medicine: Medicine;
    nextAlertTime: string;
    timeUntil: string;
  }
  
  export interface FeatureCard {
    title: string;
    icon: string;
    backgroundColor: string;
    route: string;
  }