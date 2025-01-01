import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { LocalNotifications } from '@capacitor/local-notifications';
import { useEffect } from 'react';
import AuthRoute from './components/AuthRoute';

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
import LoginScreen from './pages/Authentication/LoginScreen';
import OTPScreen from './pages/Authentication/OtpScreen';
import HomeScreen from './pages/HomeScreen';
import MedicineListScreen from './pages/Medicines/MedicineListScreen';
import PrescriptionsScreen from './pages/Prescriptions/PrescriptionsScreen';
import OnboardingName from './pages/Onboarding/OnboardingName';
import OnboardingGenderDOB from './pages/Onboarding/OnboardingGenderDOB';
import AlertScreen from './pages/Alerts/AlertScreen';
// import TrackScreen from './pages/track/TrackScreen';

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
      <AuthRoute exact path="/login" component={LoginScreen} requiresAuth={false} />
          <AuthRoute exact path="/otp" component={OTPScreen} requiresAuth={false} />
          <AuthRoute exact path="/onboarding-name" component={OnboardingName} requiresAuth={true} />
          <AuthRoute exact path="/gender-dob" component={OnboardingGenderDOB} requiresAuth={true} />
          <AuthRoute exact path="/home" component={HomeScreen} requiresAuth={true} />
          <AuthRoute exact path="/medicine-list" component={MedicineListScreen} requiresAuth={true} />
          <AuthRoute exact path="/prescriptions" component={PrescriptionsScreen} requiresAuth={true} />
          <AuthRoute exact path="/alerts" component={AlertScreen} requiresAuth={true} />
          {/* <AuthRoute exact path="/track" component={TrackScreen} requiresAuth={true} /> */}
          <Route exact path="/">
            <AuthRoute path="/" component={HomeScreen} requiresAuth={true} />
          </Route>
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);
}



export default App;
