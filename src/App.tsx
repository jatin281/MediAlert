import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { LocalNotifications } from '@capacitor/local-notifications';
import { useEffect } from 'react';
import Home from './pages/Home';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';
import LoginScreen from './pages/LoginScreen';
import OTPScreen from './pages/OtpScreen';
import HomeScreen from './pages/HomeScreen';
import MedicineListScreen from './pages/Medicines/MedicineListScreen';
import PrescriptionsScreen from './pages/PrescriptionsScreen';
import OnboardingName from './pages/Onboarding/OnboardingName';
import OnboardingGenderDOB from './pages/Onboarding/OnboardingGenderDOB';
import AlertScreen from './pages/Alerts/AlertScreen';

setupIonicReact();


const App: React.FC = () => {

  useEffect(() => {
    const requestNotificationPermissions = async () => {
      try {
        await LocalNotifications.requestPermissions();
      } catch (error) {
        console.error('Error requesting notification permissions:', error);
      }
    };
    
    requestNotificationPermissions();
  }, []);
  
return(
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
      <Route exact path="/name" component={OnboardingName}/>
      <Route exact path="/gender-dob" component={OnboardingGenderDOB}/>
        <Route exact path="/login">
          <LoginScreen />
        </Route>
        <Route exact path="/otp" component={OTPScreen}/>
        <Route exact path="/home" component={HomeScreen}/>
        <Route exact path="/medicine-list" component={MedicineListScreen}/>
        <Route exact path="/prescriptions" component={PrescriptionsScreen}/>
        <Route exact path="/alerts" component={AlertScreen}/>
        <Route exact path="/">
          <Redirect to="/home"/>
        </Route>
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);
}



export default App;
