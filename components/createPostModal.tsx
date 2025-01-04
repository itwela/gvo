import { gvoColors } from '@/constants/Colors';
import React, { useState, useRef, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, Animated, StyleSheet, TextInput, KeyboardAvoidingView, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FastImage from 'react-native-fast-image';
import { useGVOContext } from '@/constants/gvoContext';
import sql from '@/helpers/neonClient';
import { useUser } from '@clerk/clerk-expo';

const CreatePostModal = ({ visible, onClose, userImg }: { visible: boolean; onClose: () => void; userImg: string }) => {
  
  const [showModal, setShowModal] = useState(visible);
  const scaleValue = useRef(new Animated.Value(0)).current;
  const textInputRef = useRef<TextInput>(null);
  const {threads, allThreads, setThreads, setAllThreads} = useGVOContext();
  const {sessions, setSessions} = useGVOContext();
  const {gvoUserName} = useGVOContext();
  const {user} = useUser();


  useEffect(() => {
    if (visible) {
      setShowModal(true);
      textInputRef.current?.focus();
    } else {
      setShowModal(false);
    }
  }, [visible]);

  useEffect(() => {
    // Ensure keyboard is always visible
    const keyboardShowListener = Keyboard.addListener('keyboardDidHide', () => {
      textInputRef.current?.focus();
    });

    return () => {
      keyboardShowListener.remove();
    };
  }, []);

  const fetchAllThreads = async () => {
    const result = await sql`SELECT * FROM posts ORDER BY created_at DESC`;
    setAllThreads?.(result);
    console.log(result);
  };

  const fetchThreads = async () => {
    const result = await sql`SELECT * FROM posts WHERE clerk_id = ${user?.id} ORDER BY created_at DESC`;
    setThreads?.(result);
    console.log(result);
  };

  const fetchSessions = async () => {
    const result = await sql`SELECT * FROM bookings WHERE clerk_id = ${user?.id} ORDER BY created_at DESC`;
    setSessions?.(result);
    console.log(result);
  };


  const {contentForm, setContentForm} = useGVOContext();
  const postToCommunity = async () => {
    console.log(contentForm?.content);
    const uuid = user?.id;
    const title = contentForm?.content.slice(0, 60);
    const link = "https://youtube.com/mytrack";
    const likeCount = 0;
    const username = gvoUserName;
    const img = userImg; // Corrected to use the passed userImg prop

    try {
      const response = await sql`
        INSERT INTO posts 
        (
          title,
          content,
          link,
          like_count,
          username,
          user_img_url,
          clerk_id
        ) 
        VALUES 
        (
          ${title},
          ${contentForm?.content},
          ${link},
          ${likeCount},
          ${username},
          ${img},
          ${uuid} 
        )`;
      console.log(response);
      fetchSessions();
      fetchAllThreads();
      fetchThreads();
      console.log("post created");
      onClose();
    } catch (error) {
      console.log(error);
    }
    setContentForm?.(null);

  };


  if (showModal === false) return null;

  return (
    <Modal
      transparent
      visible={showModal}
      animationType="fade"
      onRequestClose={onClose}
    >
      {/* <SafeAreaView style={styles.modalBackground}> */}
        <KeyboardAvoidingView
          style={styles.modalContainer}
          behavior="padding"
          keyboardVerticalOffset={45}
        >
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <TouchableOpacity onPress={onClose}>
                <Text allowFontScaling={false} style={styles.closeButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.headerCenter}>
              <Text allowFontScaling={false} style={styles.closeButtonText}>New Post</Text>
            </View>
            <View style={styles.headerRight}>
              <View style={styles.infoIcon}>
                <Text allowFontScaling={false} style={{ fontWeight: 'bold' }}>i</Text>
              </View>
            </View>
          </View>
          <View style={styles.body}>
            <View style={styles.inputContainer}>
              <View style={styles.personImage}>
                <FastImage source={{ uri: userImg }} style={styles.personImageStyle} />
              </View>
              <View style={styles.textInputWrapper}>
                <Text style={styles.modalText}>Post</Text>
                <TextInput
                  ref={textInputRef}
                  multiline
                  placeholder="What do you want to say?"
                  style={styles.modalPostText}
                  autoFocus
                  value={contentForm?.content}
                  onChangeText={(text) => setContentForm?.({ ...contentForm, content: text })}
                />
              </View>
            </View>
            <View style={styles.footer}>
              <TouchableOpacity onPress={postToCommunity} style={styles.closeButton}>
                <Text style={styles.footerButtonText}>Post</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      {/* </SafeAreaView> */}
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    height: '100%',

  },
  modalContainer: {
    width: '100%',
    height: '95%',
    backgroundColor: gvoColors.darkBackground,
    alignItems: 'center',
    padding: 10,
    position: 'absolute',
    bottom: 0,
    zIndex: 100,
  },
  header: {
    width: '100%',
    padding: 30,
    borderBottomColor: gvoColors.semidark,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    width: '25%',
    alignItems: 'flex-start',
  },
  headerCenter: {
    width: '50%',
    alignItems: 'center',
  },
  headerRight: {
    width: '25%',
    alignItems: 'flex-end',
  },
  infoIcon: {
    backgroundColor: gvoColors.dutchWhite,
    borderRadius: 100,
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    width: '100%',
    height: '90%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputContainer: {
    width: '100%',
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 30,
  },
  personImage: {
    width: 35,
    height: 35,
    borderRadius: 50,
  },
  personImageStyle: {
    width: '100%',
    height: '100%',
    borderRadius: 100,
  },
  textInputWrapper: {
    width: '90%',
  },
  modalText: {
    fontSize: 18,
    color: gvoColors.dutchWhite,
    fontWeight: 'bold',
  },
  modalPostText: {
    fontSize: 18,
    color: gvoColors.dutchWhite,
    width: '85%',
  },
  footer: {
    width: '100%',
    height: 40,
    alignItems: 'flex-end',
    paddingHorizontal: 15,
  },
  closeButton: {
    borderRadius: 50,
    padding: 10,
    paddingHorizontal: 20,
    backgroundColor: gvoColors.maize,
  },
  footerButtonText: {
    color: gvoColors.azure,
    fontWeight: 'bold',
    fontSize: 16,
  },
  closeButtonText: {
    color: gvoColors.dutchWhite,
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default CreatePostModal;