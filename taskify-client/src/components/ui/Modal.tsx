import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Keyboard,
  Modal as RNModal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/use-theme';
import { Radius, Spacing } from '@/constants/theme';

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function Modal({ visible, onClose, children, footer }: ModalProps) {
  const { colors, shadows } = useTheme();
  const insets = useSafeAreaInsets();
  const { height: screenHeight } = useWindowDimensions();
  const translateY = useRef(new Animated.Value(0)).current;
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const onShow = Keyboard.addListener(showEvent, (e) => {
      setKeyboardHeight(e.endCoordinates.height);
      Animated.timing(translateY, {
        toValue: -e.endCoordinates.height,
        duration: Platform.OS === 'ios' ? e.duration : 150,
        useNativeDriver: true,
      }).start();
    });

    const onHide = Keyboard.addListener(hideEvent, (e) => {
      setKeyboardHeight(0);
      Animated.timing(translateY, {
        toValue: 0,
        duration: Platform.OS === 'ios' ? e.duration : 150,
        useNativeDriver: true,
      }).start();
    });

    return () => {
      onShow.remove();
      onHide.remove();
    };
  }, [translateY]);

  useEffect(() => {
    if (!visible) {
      translateY.setValue(0);
      setKeyboardHeight(0);
    }
  }, [visible, translateY]);

  // Shrinks when keyboard is up so sheet never extends behind keyboard
  const maxSheetHeight = keyboardHeight > 0
    ? screenHeight - keyboardHeight - insets.top - 16
    : screenHeight * 0.85;

  const paddingBottom = Spacing.lg + insets.bottom;

  return (
    <RNModal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Animated.View style={{ transform: [{ translateY }] }}>
          <Pressable
            style={[
              styles.content,
              {
                backgroundColor: colors.popover,
                maxHeight: maxSheetHeight,
                ...shadows.md,
              },
            ]}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.handle} />

            <ScrollView
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="on-drag"
              showsVerticalScrollIndicator={false}
              bounces={false}
              contentContainerStyle={styles.scrollContent}
            >
              {children}
            </ScrollView>

            {footer && (
              <View style={[styles.footer, { paddingBottom }]}>
                {footer}
              </View>
            )}

            {!footer && <View style={{ height: paddingBottom }} />}
          </Pressable>
        </Animated.View>
      </Pressable>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  content: {
    borderTopLeftRadius: Radius.lg,
    borderTopRightRadius: Radius.lg,
    padding: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: 0,
  },
  scrollContent: {
    flexGrow: 1,
  },
  footer: {
    paddingTop: Spacing.lg,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(128,128,128,0.3)',
    alignSelf: 'center',
    marginBottom: Spacing.base,
  },
});
