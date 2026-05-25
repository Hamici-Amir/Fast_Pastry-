import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Keyboard,
  Image
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  ArrowLeft, 
  Paperclip, 
  Camera, 
  Send, 
  Award,
  MoreVertical,
  CheckCheck,
  Package
} from 'lucide-react-native';
import Animated, { 
  FadeInDown,
  FadeInRight,
  FadeInLeft,
  Layout
} from 'react-native-reanimated';
import { theme } from '../src/theme';
import { GlassBox } from '../src/components/ui/GlassBox';
import { AppHeader } from '../src/components/common/AppHeader';

const { width } = Dimensions.get('window');

type Message = {
  id: string;
  text: string;
  sender: 'client' | 'concierge' | 'ambassador';
  timestamp: string;
  isRead: boolean;
};

const INITIAL_MESSAGES: Message[] = [
  {
    id: 'm1',
    text: 'Bonjour! Chef Jean-Luc has sealed your Imperial Gold Opulence Cake. Ambassador Jean-Pierre is en route.',
    sender: 'concierge',
    timestamp: '1:45 PM',
    isRead: true
  },
  {
    id: 'm2',
    text: 'Merci! Is it possible to leave it at the reception if I am not home?',
    sender: 'client',
    timestamp: '1:48 PM',
    isRead: true
  },
  {
    id: 'm3',
    text: 'Hello, this is Jean-Pierre your ambassador. I have a refrigerated cloche to ensure perfect condition. I can leave it at the reception if they have a cool space. I will arrive in ~10 minutes.',
    sender: 'ambassador',
    timestamp: '1:52 PM',
    isRead: true
  }
];

export default function ChatScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);
  
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');

  // Scroll to bottom on new message or keyboard open
  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', () => {
      setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
    });
    return () => {
      showSub.remove();
    };
  }, []);

  const handleSend = () => {
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: 'client',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: false
    };

    setMessages(prev => [...prev, newMessage]);
    setInputText('');
    
    setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);

    // Simulate reply
    setTimeout(() => {
      const reply: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Understood. I will ensure it is handled with the utmost care upon arrival. See you shortly.',
        sender: 'ambassador',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isRead: true
      };
      setMessages(prev => {
        const updated = [...prev, reply];
        // Mark previous as read
        updated[updated.length - 2].isRead = true;
        return updated;
      });
      setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
    }, 2500);
  };

  const renderMessage = (msg: Message) => {
    const isClient = msg.sender === 'client';
    const isAmbassador = msg.sender === 'ambassador';
    
    return (
      <Animated.View 
        key={msg.id}
        entering={isClient ? FadeInRight.duration(400) : FadeInLeft.duration(400)}
        layout={Layout.springify().damping(18).stiffness(150)}
        style={[
          styles.messageRow,
          isClient ? styles.messageRowRight : styles.messageRowLeft
        ]}
      >
        {!isClient && (
          <View style={[styles.avatarBubble, isAmbassador ? styles.avatarAmbassador : styles.avatarConcierge]}>
            {isAmbassador ? (
              <Text style={styles.avatarText}>JP</Text>
            ) : (
              <Award size={14} color="#D4A373" />
            )}
          </View>
        )}
        
        <View style={[
          styles.messageBubble,
          isClient ? styles.messageBubbleClient : styles.messageBubbleSupport
        ]}>
          <Text style={[styles.messageText, isClient && styles.messageTextClient]}>
            {msg.text}
          </Text>
          
          <View style={styles.messageFooter}>
            <Text style={[styles.messageTime, isClient && styles.messageTimeClient]}>
              {msg.timestamp}
            </Text>
            {isClient && (
              <CheckCheck 
                size={12} 
                color={msg.isRead ? '#D4A373' : 'rgba(212, 163, 115, 0.4)'} 
                style={{ marginLeft: 4 }} 
              />
            )}
          </View>
        </View>
      </Animated.View>
    );
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Background Soft Gradient */}
      <LinearGradient 
        colors={['#FFF8F2', '#FDF5EC']} 
        style={StyleSheet.absoluteFillObject}
      />

      {/* Universal Modern Header */}
      <AppHeader 
        title="Boutique Concierge"
        subtitle="Order FP-892110 • Active"
        showBack
        onBackPress={() => router.back()}
        rightContent={
          <TouchableOpacity className="w-11 h-11 items-center justify-center rounded-2xl bg-white/80 border border-[#D4A373]/20 shadow-sm mr-3">
            <MoreVertical size={20} color="#2C1B18" />
          </TouchableOpacity>
        }
      />

      {/* Floating Context Badge */}
      <View style={styles.contextBadge}>
        <Package size={12} color="#D4A373" />
        <Text style={styles.contextBadgeText}>Ambassador Jean-Pierre is handling your delivery.</Text>
      </View>

      {/* Message List */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.chatArea}
        contentContainerStyle={styles.chatContent}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        <Text style={styles.dateSeparator}>Today, 1:40 PM</Text>
        {messages.map(renderMessage)}
      </ScrollView>

      {/* Premium Input Compose Bar */}
      <View style={[styles.inputWrapper, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <GlassBox intensity={90} style={styles.inputGlassContainer} tint="light">
          
          <TouchableOpacity style={styles.actionButton}>
            <Paperclip size={20} color="#8C7A77" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Camera size={20} color="#8C7A77" />
          </TouchableOpacity>

          <TextInput
            style={styles.textInput}
            placeholder="Message the boutique..."
            placeholderTextColor="#C5B6B3"
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
          />

          {inputText.trim().length > 0 ? (
            <Animated.View entering={FadeInRight.duration(200)}>
              <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
                <LinearGradient
                  colors={['#C59567', '#D4A373']}
                  style={styles.sendGradient}
                >
                  <Send size={16} color="#FFFFFF" style={{ marginLeft: -2 }} />
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          ) : (
            <View style={{ width: 44 }} /> // Placeholder for spacing
          )}

        </GlassBox>
      </View>

    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F2',
  },
  contextBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(212, 163, 115, 0.1)',
    alignSelf: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: 'rgba(212, 163, 115, 0.3)',
  },
  contextBadgeText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 9.5,
    color: '#D4A373',
    marginLeft: 6,
  },
  chatArea: {
    flex: 1,
  },
  chatContent: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 24,
  },
  dateSeparator: {
    alignSelf: 'center',
    fontFamily: 'Cairo-Bold',
    fontSize: 10,
    color: '#C5B6B3',
    marginBottom: 24,
    letterSpacing: 0.5,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 16,
    maxWidth: '85%',
  },
  messageRowLeft: {
    alignSelf: 'flex-start',
  },
  messageRowRight: {
    alignSelf: 'flex-end',
  },
  avatarBubble: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'rgba(232, 211, 194, 0.5)',
  },
  avatarConcierge: {
    backgroundColor: '#FAF5EE',
  },
  avatarAmbassador: {
    backgroundColor: '#E8C39E',
  },
  avatarText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 10,
    color: '#2C1B18',
  },
  messageBubble: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
    shadowColor: '#2C1B18',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  messageBubbleSupport: {
    backgroundColor: '#FFFFFF',
    borderColor: 'rgba(232, 211, 194, 0.3)',
    borderBottomLeftRadius: 4,
  },
  messageBubbleClient: {
    backgroundColor: '#FAF0E6',
    borderColor: 'rgba(212, 163, 115, 0.25)',
    borderBottomRightRadius: 4,
  },
  messageText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 13,
    color: '#4A3B39',
    lineHeight: 18,
  },
  messageTextClient: {
    color: '#2C1B18',
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 6,
  },
  messageTime: {
    fontFamily: 'Cairo-SemiBold',
    fontSize: 9,
    color: '#C5B6B3',
  },
  messageTimeClient: {
    color: '#B09A97',
  },
  inputWrapper: {
    paddingTop: 8,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255, 248, 242, 0.9)',
  },
  inputGlassContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderRadius: 24,
    paddingHorizontal: 6,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(232, 211, 194, 0.5)',
  },
  actionButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  textInput: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#2C1B18',
    paddingTop: 12,
    paddingBottom: 12,
    paddingHorizontal: 8,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
    shadowColor: '#D4A373',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  sendGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  }
});
