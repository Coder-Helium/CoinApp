import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import type {CompositeNavigationProp} from '@react-navigation/native';
import type {AuthStackParamList, ProfileStackParamList} from '../../../App';
import {useAuthStore} from '../../hooks/useAuthStore';
import {observer} from 'mobx-react-lite';
//import {userApi} from '../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useProfileStore } from '../../hooks/useProfileStore';

// Define a composite navigation type that works for both stacks
type ProfileSetupScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<AuthStackParamList, 'ProfileSetup'>,
  StackNavigationProp<ProfileStackParamList>
>;

const ProfileSetupScreen = observer(() => {
  const navigation = useNavigation<ProfileSetupScreenNavigationProp>();
  const authStore = useAuthStore();
  const profileStore = useProfileStore();

  const [country, setCountry] = useState('');
  const [region, setRegion] = useState('');
  const [city, setCity] = useState('');
  const [fieldOfStudy, setFieldOfStudy] = useState('');
  const [levelOfStudy, setLevelOfStudy] = useState('');
  const [university, setUniversity] = useState('');
  const [language, setLanguage] = useState('');
  const [loading, setLoading] = useState(false);

  const [tempSignupData, setTempSignupData] = useState<any>(null);

  // Determine if this is registration or profile editing
  const isRegistration = !authStore.isAuthenticated;

  // Pre-populate fields with user data when in edit mode
  // todo: 修改
  useEffect(() => {
    if (!isRegistration && authStore.user) {
      // Set fields from user data
      setCountry(profileStore?.profile?.userCountry || '');
      setRegion(profileStore?.profile?.userRegions || '');
      setCity(profileStore?.profile?.userCity || '');
      setFieldOfStudy(profileStore?.profile?.userField || '');
      setLevelOfStudy(profileStore?.profile?.levelOfStudy || '');
      setUniversity(profileStore?.profile?.userUni || '');
      setLanguage(profileStore?.profile?.userLanguage || '');
    }
  }, [
    isRegistration,
    authStore.user,
    profileStore?.profile,
  ]);

  // Load signup data from AsyncStorage if in registration flow
  useEffect(() => {
    const loadSignupData = async () => {
      if (isRegistration) {
        try {
          const signupDataJson = await AsyncStorage.getItem('temp_signup_data');
          if (signupDataJson) {
            setTempSignupData(JSON.parse(signupDataJson));
          } else {
            // No signup data found - this indicates the user has not gone through the proper signup flow
            Alert.alert(
              'Sign Up Required',
              'Please complete the sign up form first before proceeding to profile setup.',
              [
                {
                  text: 'Go to Sign Up',
                  onPress: () => navigation.navigate('Signup'),
                },
              ]
            );
          }
        } catch (error) {
          console.error('Error loading signup data:', error);
          Alert.alert('Error', 'There was a problem loading your registration data. Please try again.');
          navigation.navigate('Signup');
        }
      }
    };

    loadSignupData();
  }, [isRegistration, navigation]);

  // Load country list
  // useEffect(() => {
  //   const fetchCountries = async () => {
  //     try {
  //       const data = await userApi.getCountries();
  //       setCountries(data || []);
  //     } catch (error) {
  //       console.error('Failed to get country list:', error);
  //     } finally {
  //       setLoadingData(false);
  //     }
  //   };

  //   fetchCountries();
  // }, []);

  // // Get region list after selecting a country
  // useEffect(() => {
  //   if (country) {
  //     const fetchRegions = async () => {
  //       setLoadingData(true);
  //       try {
  //         // Assume country stores the country code
  //         const data = await userApi.getRegions(country);
  //         setRegions(data || []);
  //       } catch (error) {
  //         console.error('Failed to get region list:', error);
  //       } finally {
  //         setLoadingData(false);
  //       }
  //     };

  //     fetchRegions();
  //   }
  // }, [country]);

  const handleComplete = async () => {
    // Validate required fields
    if (!country || !region || !city || !fieldOfStudy || !levelOfStudy || !university || !language) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      // Build profile data
      const profileData = {
        userCountry: country,
        userRegions: region,
        userCity: city,
        userField: fieldOfStudy,
        levelOfStudy,
        userUni: university,
        userLanguage: language,
      };

      // Differentiate between registration flow and profile update flow
      if (isRegistration) {
        // Registration flow - user is not logged in, this is the final step of registration
        if (!tempSignupData) {
          Alert.alert('Error', 'Registration data is missing. Please try again.');
          navigation.navigate('Signup');
          return;
        }

        // Create the complete registration data
        const completeRegistrationData = {
          ...tempSignupData,
          ...profileData,
        };

        // Call the register API
        const success = await authStore.register(completeRegistrationData);

        if (success) {
          // Clean up the temporary signup data
          await AsyncStorage.removeItem('temp_signup_data');

          Alert.alert(
            'Success',
            'Your account has been created successfully. Please login to continue.',
            [
              {
                text: 'Go to Login',
                onPress: () => {
                  navigation.navigate('Login');
                },
              },
            ]
          );
        }
      } else {
        // Profile update flow - user is already logged in, just updating their profile
        if (!authStore.user?.id) {
          Alert.alert('Error', 'Please login first before updating your profile');
          navigation.navigate('Login');
          return;
        }

        const success = await authStore.updateProfile(authStore.user.id, profileData);

        if (success) {
          Alert.alert(
            'Success',
            'Your profile has been updated successfully',
            [
              {
                text: 'Back',
                onPress: () => navigation.goBack(),
              },
            ]
          );
          
        }
      }
    } catch (error) {
      console.error('Error completing profile:', error);
      Alert.alert('Error', 'An error occurred while updating your profile');
    } finally {
      setLoading(false);
    }
  };

  // if (loadingData) {
  //   return (
  //     <SafeAreaView style={styles.loadingContainer}>
  //       <ActivityIndicator size="large" color="#006400" />
  //       <Text style={styles.loadingText}>Loading data...</Text>
  //     </SafeAreaView>
  //   );
  // }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidView}>
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View style={styles.formContainer}>
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Current Country</Text>
              <View style={styles.selectContainer}>
                <TextInput
                  style={styles.selectInput}
                  placeholder="Input your current country"
                  value={country}
                  onChangeText={setCountry}
                />

              </View>
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Current Region</Text>
              <View style={styles.selectContainer}>
                <TextInput
                  style={styles.selectInput}
                  placeholder="Input your current region"
                  value={region}
                  onChangeText={setRegion}
                />

              </View>
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Target City</Text>
              <View style={styles.selectContainer}>
                <TextInput
                  style={styles.selectInput}
                  placeholder="Input your target city"
                  value={city}
                  onChangeText={setCity}
                />

              </View>
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Field of Study</Text>
              <View style={styles.selectContainer}>
                <TextInput
                  style={styles.selectInput}
                  placeholder="Input your field of study"
                  value={fieldOfStudy}
                  onChangeText={setFieldOfStudy}
                />

              </View>
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Level of Study</Text>
              <View style={styles.selectContainer}>
                <TextInput
                  style={styles.selectInput}
                  placeholder="Input your level of study"
                  value={levelOfStudy}
                  onChangeText={setLevelOfStudy}
                />

              </View>
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>University/School</Text>
              <View style={styles.selectContainer}>
                <TextInput
                  style={styles.selectInput}
                  placeholder="Input your university or school"
                  value={university}
                  onChangeText={setUniversity}
                />

              </View>
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Preferred Language</Text>
              <View style={styles.selectContainer}>
                <TextInput
                  style={styles.selectInput}
                  placeholder="Input your preferred language"
                  value={language}
                  onChangeText={setLanguage}
                />

              </View>
            </View>

            <TouchableOpacity
              style={styles.completeButton}
              onPress={handleComplete}
              disabled={loading}>
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.completeButtonText}>
                  {isRegistration ? 'Complete Profile' : 'Update Profile'}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#006400',
  },
  keyboardAvoidView: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    fontSize: 24,
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 30,
  },
  formContainer: {
    width: '100%',
  },
  fieldContainer: {
    marginBottom: 15,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 5,
  },
  selectContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    height: 50,
  },
  selectInput: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 15,
    fontSize: 16,
  },
  selectArrow: {
    paddingHorizontal: 15,
    fontSize: 12,
    color: '#666',
  },
  completeButton: {
    backgroundColor: '#006400',
    height: 50,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  completeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileSetupScreen;
