import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { auth } from './firebase';
import { signInWithCredential, GoogleAuthProvider } from 'firebase/auth';

WebBrowser.maybeCompleteAuthSession();

const redirectUri = AuthSession.makeRedirectUri({
  useProxy: true,
});

export const signInWithGoogleMobile = async () => {
  try {
    const clientId = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID;
    
    if (!clientId) {
      throw new Error('Google Client ID not configured');
    }

    const request = new AuthSession.AuthRequest({
      clientId,
      scopes: ['openid', 'profile', 'email'],
      redirectUri,
      responseType: AuthSession.ResponseType.IdToken,
    });

    const result = await request.promptAsync({
      authorizationEndpoint: 'https://accounts.google.com/oauth/authorize',
    });

    if (result.type === 'success') {
      const { id_token } = result.params;
      const credential = GoogleAuthProvider.credential(id_token);
      const firebaseResult = await signInWithCredential(auth, credential);
      
      return {
        user: firebaseResult.user,
        success: true
      };
    } else {
      return {
        user: null,
        success: false,
        error: 'User cancelled or authentication failed'
      };
    }
  } catch (error) {
    console.error('Google sign in error:', error);
    return {
      user: null,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};