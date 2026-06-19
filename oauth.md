Google OAuth Implementation                                                                                                   
                                                                                                                                
  Package Used                                                                                                                  
                                                                                                                                
  @react-native-google-signin/google-signin — native Google Sign-In SDK (not Expo's web-based OAuth). This gives you the native 
  account picker sheet.                                           
                                                                                                                                
  ---                                                             
  Setup (context/AuthContext.tsx)
                                                                                                                                
  Configuration (line 56-62):
  GoogleSignin.configure({                                                                                                      
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,    
    offlineAccess: false,                                     
    scopes: ['openid', 'email', 'profile'],                                                                                     
  });                                      
  Runs once on mount. webClientId comes from Google Cloud Console and is stored in .env.                                        
                                                                  
  ---                                                                                                                           
  Auth Flow (signInWithGoogle, lines 147-204)
                                                                                                                                
  Three steps:                                                    
  1. GoogleSignin.hasPlayServices() — checks Android Play Services availability                                                 
  2. GoogleSignin.signIn() — launches native Google account picker, returns idToken                                             
  3. supabase.auth.signInWithIdToken({ provider: 'google', token: idToken }) — exchanges the Google ID token for a Supabase     
  session                                                                                                                       
                                                                                                                                
  Supabase then fires its onAuthStateChange listener which handles the rest (setting session, fetching profile).                
                                                                                                                                
  ---                                                             
  Sign Out (signOut, lines 428-462)                                                                                             
                                                                  
  supabase.auth.signOut()
  → GoogleSignin.revokeAccess()   // fully disconnects, shows picker again next time
  → GoogleSignin.signOut()        // clears cached account                                                                      
  → clear local state (session/user/profile = null)                                                                             
                                                                                                                                
  revokeAccess() before signOut() ensures the account picker reappears next login (not auto-signin).                            
                                                                                                                                
  ---                                                                                                                           
  State Management (lines 464-534)                                
                                                                                                                                
  onAuthStateChange listener handles everything after a sign-in:
  - Sets session and user                                                                                                       
  - Detects new users (created within last 5s → isNewUser = true) 
  - Fetches profile from profiles table via fetchProfile()                                                                      
  - Sets loading = false                                                                                                        
                                                                                                                                
  AppState listener (active/background) calls startAutoRefresh / stopAutoRefresh for token management.                          
                                                                                                                                
  ---                                                             
  Files & Responsibilities                                                                                                      
                                                                  
  ┌─────────────────────────┬────────────────────────────────────────────────────────────────────────────────────────────────┐
  │          File           │                                              Role                                              │
  ├─────────────────────────┼────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ context/AuthContext.tsx │ All auth logic: signInWithGoogle, signOut, handleAuthCallback, GoogleSignin.configure(),       │
  │                         │ Supabase session management                                                                    │
  ├─────────────────────────┼────────────────────────────────────────────────────────────────────────────────────────────────┤  
  │ app/_layout.tsx         │ Wraps the entire app in <AuthProvider> (line 69), making auth context available everywhere     │
  └─────────────────────────┴────────────────────────────────────────────────────────────────────────────────────────────────┘  
                                                                  
  ---                                                                                                                           
  How It Ties Together                                            

  app/_layout.tsx
    └─ <AuthProvider>          ← mounts AuthContext, configures GoogleSignin
         └─ any screen                                                                                                          
              └─ useAuth()     ← gets signInWithGoogle, signOut, session, profile, etc.                                         
                                                                                                                                
  The provider sits at the root so any screen can call useAuth() and get the full auth state. The actual Google→Supabase        
  handshake lives entirely in signInWithGoogle, and Supabase's auth state change listener is the single source of truth for     
  updating local state.      