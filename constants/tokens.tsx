import { IconSymbol } from '@/components/ui/IconSymbol';
import { gvoColors } from './Colors';
import { StyleSheet } from 'react-native';
export const linkCheck = 'https://youtube.com/mytrack'
export const lineBreak = '\n';

export const faq = `${lineBreak}GVO Studios is a social platform that allows users to connect with like minded individuals, manage and book studio time with us, and finally a place to spread good vibes!
${lineBreak}
Initially founded by Narqui$e (A talented producer in the music industry), we want to continue his legacy by ushering in the next generation of producers/ artists, and talented people.
`

import React from 'react';

const CalendarIcon = () => <IconSymbol name="calendar.badge.clock" size={24} color={gvoColors.dutchWhite} />;
const MessageIcon = () => <IconSymbol name="message.fill" size={24} color={gvoColors.dutchWhite} />;

export const faqquestions = [
    {
        question: 'What is GVO Studios?',
        answer: faq
    },
    {
        question: 'How do I book studio time?',
        answer: (
            <>
                {lineBreak}Click to the <CalendarIcon /> tab at the bottom of the screen, select a date, choose an available time slot, and confirm your booking.{lineBreak}
            </>
        )
    },
    {
        question: 'How do I create a new post?',
        // answer: `${lineBreak}Go to the “Post” section, select a date, choose an available time slot, and confirm your booking.${lineBreak}`
        answer: (
            <>
                {lineBreak}Click to the <MessageIcon /> tab at the bottom of the screen, Click the yellow and blue button at the bottom of the screen to post to the community.{lineBreak}
            </>
        )
    },
    {
        question: 'What should I do if I encounter a technical issue?',
        answer: `${lineBreak}Contact support by calling us at${lineBreak}${lineBreak}(123) 456-7890${lineBreak}${lineBreak}or email us at ${lineBreak}${lineBreak}[support@example.com].${lineBreak}`
    },
    {
        question: 'Is there a fee for booking time?',
        answer: `${lineBreak}No, there is no fee for booking time.${lineBreak}`
    },
    {
        question: "",
        answer: ""
    },
]

export const buttonStyle = StyleSheet.create({
    mainButton: {
      backgroundColor: gvoColors.azure,
      borderRadius: 10,
      paddingVertical: 12,
      paddingHorizontal: 16,
      color: gvoColors.dutchWhite,
      width: '100%',
    },
    mainButtonText: {
      fontSize: 20,
      fontWeight: 'bold',
      textAlign: 'center',
    }
  })
  
  export const utilStyle = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    safeAreaContainer: {
      flex: 1,
      alignItems: 'center',
      backgroundColor: "transparent"
    },
    padding: {
      padding: 20
    },
    text: {
      fontSize: 60,
      fontWeight: 'bold',
    },
    option: {
      fontSize: 20,
      paddingVertical: 10,
      textAlign: 'center',
      fontWeight: 'bold',
      color: gvoColors.dutchWhite
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      textAlign: 'center',
      color: gvoColors.dutchWhite
    },
    separator: {
      marginVertical: 30,
      height: 1,
      width: '80%',
    },
    selectionText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: gvoColors.dutchWhite
    },
    button: {
        width: '100%', 
        display: 'flex', 
        justifyContent: 'center', 
        alignContent: 'center', 
        alignItems: 'center', 
        backgroundColor: gvoColors.azure, 
        borderRadius: 80, 
        padding: 8,
        marginVertical: 10,
  },
  })
  