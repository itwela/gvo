import { Modal, View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { gvoColors } from '@/constants/Colors';
import { fontSizes } from '@/constants/Fontsizes';
import { faq, faqquestions } from '@/constants/tokens';

export const FaqModal = ({ visible, onClose }: { visible: boolean; onClose: () => void; }) => {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalBackground}>
                <View style={styles.modalContainer}>
                <ScrollView>
                    <View style={{width: '100%', alignItems: 'flex-end'}}>
                           <View style={{height: 20}}/> 
                        <TouchableOpacity onPress={onClose}>
                            <Text style={{ color: gvoColors.dutchWhite, fontSize: fontSizes.small }}>Close</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={{ color: gvoColors.dutchWhite, fontSize: fontSizes.large }}>FAQ</Text>
                    <View style={{width: '100%', height: 1, marginVertical: 20, backgroundColor: gvoColors.semidark}}/>
                    <View>
                        {faqquestions?.map((faq, index) => (
                            <View key={index}>
                                <Text style={{ color: gvoColors.azure, fontSize: fontSizes.medium, fontWeight: 'bold' }}>{faq.question}</Text>
                                <Text style={{ color: gvoColors.dutchWhite, fontSize: fontSizes.small }}>{faq.answer}</Text>
                            </View>
                        ))}
                    </View>
                </ScrollView>
                </View>
            </View>
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
      height: '65%',
      backgroundColor: gvoColors.darkBackground,
      alignItems: 'flex-start',
      padding: 10,
      paddingHorizontal: 30,
      position: 'absolute',
      bottom: 0,
      zIndex: 100,
    },
});  