import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Send, Bot, User, Palette, Zap } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { aiAssistantService } from '@/services/aiAssistantService';
import { PokemonTheme } from '@/types/pokemon';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  type?: 'text' | 'theme-change' | 'analysis' | 'recommendation';
}

interface AIAssistantChatProps {
  onThemeChange?: (theme: PokemonTheme) => void;
}

export function AIAssistantChat({ onThemeChange }: AIAssistantChatProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const scrollViewRef = useRef<ScrollView>(null);
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm DexAI, your Pokemon TCG companion. I can help you with card analysis, market insights, collection management, and theme customization. How can I assist you today?",
      isUser: false,
      timestamp: new Date(),
      type: 'text',
    },
  ]);
  
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentTheme, setCurrentTheme] = useState(aiAssistantService.getCurrentTheme());

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date(),
      type: 'text',
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI processing
    setTimeout(async () => {
      let aiResponse = aiAssistantService.generateResponse(inputText);
      let messageType: Message['type'] = 'text';

      // Handle theme changes
      if (inputText.toLowerCase().includes('theme') || inputText.toLowerCase().includes('color')) {
        const pokemonNames = ['pikachu', 'charizard', 'blastoise', 'venusaur', 'mewtwo', 'mew'];
        const mentionedPokemon = pokemonNames.find(name => 
          inputText.toLowerCase().includes(name)
        );
        
        if (mentionedPokemon) {
          const newTheme = aiAssistantService.changeTheme(mentionedPokemon);
          setCurrentTheme(newTheme);
          onThemeChange?.(newTheme);
          aiResponse = `I've changed the theme to ${newTheme.pokemon}! The interface now uses ${newTheme.pokemon}'s signature colors. How do you like the new look?`;
          messageType = 'theme-change';
        } else {
          aiResponse = "I can change the app theme to match any Generation 1 Pokemon! Try saying 'change theme to Pikachu' or 'use Charizard colors'. Which Pokemon would you like?";
        }
      }

      // Handle analysis requests
      if (inputText.toLowerCase().includes('analyze') || inputText.toLowerCase().includes('grade')) {
        aiResponse = "I'd be happy to analyze a card for you! Please use the camera feature to scan a card, and I'll provide detailed condition analysis, estimated grading, and market insights.";
        messageType = 'analysis';
      }

      // Handle market questions
      if (inputText.toLowerCase().includes('price') || inputText.toLowerCase().includes('market')) {
        aiResponse = "I can provide real-time market analysis! Search for any card and I'll show you current prices, trends, and investment potential. Would you like me to analyze a specific card?";
        messageType = 'recommendation';
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        isUser: false,
        timestamp: new Date(),
        type: messageType,
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000);
  };

  const quickActions = [
    { text: 'Change theme to Pikachu', icon: Palette },
    { text: 'Analyze my collection', icon: Zap },
    { text: 'Market trends', icon: Bot },
    { text: 'Grading tips', icon: User },
  ];

  const handleQuickAction = (text: string) => {
    setInputText(text);
  };

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const styles = getStyles(isDark, currentTheme);

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient
        colors={currentTheme.gradient}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Bot size={24} color="white" />
          <Text style={styles.headerTitle}>DexAI Assistant</Text>
          <Text style={styles.headerSubtitle}>Theme: {currentTheme.pokemon}</Text>
        </View>
      </LinearGradient>

      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.messagesContent}
      >
        {messages.map((message, index) => (
          <Animated.View
            key={message.id}
            entering={FadeInRight.delay(index * 100)}
            style={[
              styles.messageContainer,
              message.isUser ? styles.userMessage : styles.aiMessage,
            ]}
          >
            <View style={styles.messageHeader}>
              {message.isUser ? (
                <User size={16} color={currentTheme.colors.primary} />
              ) : (
                <Bot size={16} color={currentTheme.colors.primary} />
              )}
              <Text style={styles.messageTime}>
                {message.timestamp.toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </Text>
            </View>
            <Text style={[
              styles.messageText,
              message.isUser ? styles.userMessageText : styles.aiMessageText,
            ]}>
              {message.text}
            </Text>
          </Animated.View>
        ))}

        {isTyping && (
          <Animated.View
            entering={FadeInDown}
            style={[styles.messageContainer, styles.aiMessage]}
          >
            <View style={styles.typingIndicator}>
              <Bot size={16} color={currentTheme.colors.primary} />
              <Text style={styles.typingText}>DexAI is typing...</Text>
            </View>
          </Animated.View>
        )}
      </ScrollView>

      <View style={styles.quickActionsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {quickActions.map((action, index) => (
            <TouchableOpacity
              key={index}
              style={styles.quickActionButton}
              onPress={() => handleQuickAction(action.text)}
            >
              <action.icon size={16} color={currentTheme.colors.primary} />
              <Text style={styles.quickActionText}>{action.text}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Ask DexAI anything..."
          placeholderTextColor={isDark ? '#6b7280' : '#9ca3af'}
          value={inputText}
          onChangeText={setInputText}
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            { backgroundColor: currentTheme.colors.primary },
          ]}
          onPress={sendMessage}
          disabled={!inputText.trim() || isTyping}
        >
          <Send size={20} color="white" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const getStyles = (isDark: boolean, theme: PokemonTheme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDark ? '#000000' : '#f8fafc',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    flex: 1,
  },
  headerSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    gap: 12,
  },
  messageContainer: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: theme.colors.primary,
  },
  aiMessage: {
    alignSelf: 'flex-start',
    backgroundColor: isDark ? '#1f2937' : '#ffffff',
    borderWidth: 1,
    borderColor: isDark ? '#374151' : '#e5e7eb',
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  messageTime: {
    fontSize: 10,
    color: isDark ? '#9ca3af' : '#6b7280',
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  userMessageText: {
    color: 'white',
  },
  aiMessageText: {
    color: isDark ? '#ffffff' : '#1f2937',
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  typingText: {
    fontSize: 14,
    color: isDark ? '#9ca3af' : '#6b7280',
    fontStyle: 'italic',
  },
  quickActionsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  quickActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    backgroundColor: isDark ? '#1f2937' : '#ffffff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  quickActionText: {
    fontSize: 12,
    color: theme.colors.primary,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 16,
    gap: 12,
    backgroundColor: isDark ? '#1f2937' : '#ffffff',
    borderTopWidth: 1,
    borderTopColor: isDark ? '#374151' : '#e5e7eb',
  },
  textInput: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: isDark ? '#374151' : '#f3f4f6',
    borderRadius: 20,
    fontSize: 16,
    color: isDark ? '#ffffff' : '#1f2937',
    textAlignVertical: 'top',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});