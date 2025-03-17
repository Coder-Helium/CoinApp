import React, {useState} from 'react';
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
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import type {AuthStackParamList} from '../../../App';

type ProfileSetupScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  'ProfileSetup'
>;

const ProfileSetupScreen = () => {
  const navigation = useNavigation<ProfileSetupScreenNavigationProp>();
  const [country, setCountry] = useState('');
  const [region, setRegion] = useState('');
  const [city, setCity] = useState('');
  const [fieldOfStudy, setFieldOfStudy] = useState('');
  const [levelOfStudy, setLevelOfStudy] = useState('');
  const [university, setUniversity] = useState('');
  const [language, setLanguage] = useState('');

  const handleComplete = () => {
    // API call to update user profile should be here
    console.log('Profile setup completed', {
      country,
      region,
      city,
      fieldOfStudy,
      levelOfStudy,
      university,
      language,
    });
    // After completion, navigate to main page
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidView}>
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.backButton}>{'<'}</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Complete Your Profile</Text>
          </View>

          <Text style={styles.subtitle}>Please fill in the information below to complete your profile</Text>

          <View style={styles.formContainer}>
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Current Country</Text>
              <View style={styles.selectContainer}>
                <TextInput
                  style={styles.selectInput}
                  placeholder="Select your current country"
                  value={country}
                  onChangeText={setCountry}
                />
                <Text style={styles.selectArrow}>▼</Text>
              </View>
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Current Region</Text>
              <View style={styles.selectContainer}>
                <TextInput
                  style={styles.selectInput}
                  placeholder="Select your current region"
                  value={region}
                  onChangeText={setRegion}
                />
                <Text style={styles.selectArrow}>▼</Text>
              </View>
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Destination City</Text>
              <View style={styles.selectContainer}>
                <TextInput
                  style={styles.selectInput}
                  placeholder="Select your destination city"
                  value={city}
                  onChangeText={setCity}
                />
                <Text style={styles.selectArrow}>▼</Text>
              </View>
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Field of Study</Text>
              <View style={styles.selectContainer}>
                <TextInput
                  style={styles.selectInput}
                  placeholder="Select your field of study"
                  value={fieldOfStudy}
                  onChangeText={setFieldOfStudy}
                />
                <Text style={styles.selectArrow}>▼</Text>
              </View>
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Level of Study</Text>
              <View style={styles.selectContainer}>
                <TextInput
                  style={styles.selectInput}
                  placeholder="Select your level of study"
                  value={levelOfStudy}
                  onChangeText={setLevelOfStudy}
                />
                <Text style={styles.selectArrow}>▼</Text>
              </View>
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>University/School</Text>
              <View style={styles.selectContainer}>
                <TextInput
                  style={styles.selectInput}
                  placeholder="Select your university or school"
                  value={university}
                  onChangeText={setUniversity}
                />
                <Text style={styles.selectArrow}>▼</Text>
              </View>
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Preferred Language</Text>
              <View style={styles.selectContainer}>
                <TextInput
                  style={styles.selectInput}
                  placeholder="Select your preferred language"
                  value={language}
                  onChangeText={setLanguage}
                />
                <Text style={styles.selectArrow}>▼</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.completeButton}
              onPress={handleComplete}>
              <Text style={styles.completeButtonText}>Complete Profile</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
