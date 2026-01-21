import { Dimensions, Platform } from 'react-native';
import { Gesture } from 'react-native-gesture-handler';
import {
  useSharedValue,
  withTiming
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

const { width, height } = Dimensions.get('window');

interface CanvasGestureProps {
  onTap: (x: number, y: number) => void;
  activeTool: string; 
  zoomSensitivity?: number;
}

export const useGestures = ({
  onTap,
  activeTool,
  zoomSensitivity = 0.001,
}: CanvasGestureProps) => {
    //jo, wartości do sklaowania siatkowego maina
  //translaty to wartość zmieniana przez gesty/przesuniecia
  //saved to zmienne gdzie przechowywana jest wartość po ruszeniu mapą
  //żeby nie było (0,0)+(12,300) przy ruchu tylko (savedX,SavedY)+(12,300)
  const scale = useSharedValue(1);    //zapisany stan
  const savedScale = useSharedValue(1); //zapisana
  const translateX = useSharedValue(0); //oś X
  const translateY = useSharedValue(0); //oś Y (do poruszania się)
  const savedTranslateX = useSharedValue(0); //zapisana oś x
  const savedTranslateY = useSharedValue(0);//zapisana os y

  //gest przesuwania, działa też z myszką fajnie
  const panGesture = Gesture.Pan()
    .enabled(activeTool === 'hand') //hand czyli że mozesz skrollowac, inny do wstawiania
    .onUpdate((e) => {
      translateX.value = savedTranslateX.value + e.translationX;
      translateY.value = savedTranslateY.value + e.translationY;
    })
    .onEnd(() => {
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
    });

     //przybliżenie to nie działa tak jak myslałem, nie działa na scrolla, w sumie do wywalenia
  const pinchGesture = Gesture.Pinch()
    .onUpdate((e) => {
      scale.value = savedScale.value * e.scale;
    })
    .onEnd(() => {
      // Ograniczenie skali, aby nie oddalić/przybliżyć za bardzo
      if (scale.value < 0.5) {
        scale.value = withTiming(0.5); //żeby nie odskoczyło od razu tylko powli się poprawiło
      } else if (scale.value > 3) {
        scale.value = withTiming(3);
      }
      savedScale.value = scale.value;
    });

  // klikniecie
  const tapGesture = Gesture.Tap()
    .enabled(activeTool !== 'hand') 
    .onEnd((e) => {
      scheduleOnRN(onTap,e.absoluteX, e.absoluteY);
    });

  //rolka
  const handleWheel = (event: { deltaY: number }) => {
    'worklet'; // przechodzi na watek UI
    if (Platform.OS !== 'web') return;
    const newScale = scale.value - event.deltaY * zoomSensitivity;
    const clampedScale = Math.max(0.5, Math.min(newScale, 3));
    scale.value = clampedScale;
    savedScale.value = clampedScale;
  };

  const composedGesture = Gesture.Simultaneous(panGesture, pinchGesture, tapGesture);

  return {
    scale,
    translateX,
    translateY,
    composedGesture,
    handleWheel,
    savedTranslateX,
    savedTranslateY,
    savedScale
  };
};