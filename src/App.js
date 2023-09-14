import React, { useState, useEffect } from 'react';
import './App.css';
import { Amplify } from 'aws-amplify';
import { awsExports } from './aws-exports';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { Auth } from 'aws-amplify';

Amplify.configure({
  Auth: {
    region: awsExports.REGION,
    userPoolId: awsExports.USER_POOL_ID,
    userPoolWebClientId: awsExports.USER_POOL_APP_CLIENT_ID,
  },
});

function App() {
  const [jwtToken, setJwtToken] = useState('');
  const [presignedUrl, setPresignedUrl] = useState('');
  const [remainingTime, setRemainingTime] = useState(4 * 60 * 60); // 4 hours in seconds

  useEffect(() => {
    fetchJwtToken();
  }, []);

  useEffect(() => {
    Auth.signOut();
  }, []); // Automatically sign out when the page is refreshed

  const fetchJwtToken = async () => {
    try {
      const session = await Auth.currentSession();
      const token = session.getIdToken().getJwtToken();
      setJwtToken(token);
    } catch (error) {
      console.log('Error fetching JWT token:', error);
    }
  };

  // S3 Button logic
  const handleS3ButtonClick = async () => {
    try {
      // Replace 'presignedUrl' with your actual presigned URL
      const presignedUrl =
        'https://teambucketsonix.s3.ap-south-1.amazonaws.com/jenkins.zip?response-content-disposition=inline&X-Amz-Security-Token=IQoJb3JpZ2luX2VjENP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCmFwLXNvdXRoLTEiRjBEAiB%2FHy%2Bj8%2BNt1cz20D2egIpqPz7R5yEzKUaFwiAR%2FIslTAIgMEfz4NKicIy43hDl02hYSUR3eqb1SfXPmsSMJYBGj7cqjgMInP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgwyODY4NzM0Mzc3NDMiDMzjArnw3AnUwch19yriArow5EH9igU%2Bx3kxDZuc3ezaPUjEP%2Fqi%2B5G5VmeZenSVhxMcqZCJug%2F9JhvYI7vQJ9GOz28wOxlZAAd6BqLgBsniuGgsx7IVPhk1XP3GrTjhtIWlYlyXklRJejZSH%2FOwzpycVCOkY45a7UlXtAYTC4QDnNWBnjE14c13TqwU5fAh%2F5hTCsQliBC1kH7%2FaRdPidVSZaNG%2FpaB157nqhPfsvbEzZcrj0%2FwEPq8dL2WUz%2BflbQhIlzCzgJXKFI2lnVtXjcTI8bxNj5AyuH14oeFi1099W8mloLfnRdp2gIW%2FuZpkXquFBbmyf%2FsGso0HYqwJgYZ2rvdtKCH%2FNjzGoqFuD3eC1f5JjpGZIinHjQ6%2FzwbmdWMDeSytOMJFfpJh0AWJOOf%2BD12r2yCvKIBmR6m3EdljIfGC4mNxryjSTIv%2Bz5tLyfKYBDW3IY3K08io8ABUUd%2FttFsrVsHzhHt6%2BKaHuW3QTDXsrWnBjq0Aj9CRDcPOlTcjHnIjvSTEL7JohQkAVsheOIqNypipydw6w5CV6rHZDDwPwMnI4v6mZ1jY474I%2BvVvTSKQwlmn7ARECX6D78tcKtv9WGyglXUEbUcKUGUX1%2Bg4upzs6Dj3lX7GFonGg0Dig%2FRRPq%2BWDtNY3ZNFp4qgI7VByojbBYWAN16paYkbfJibCbLAl%2BxY7rbJRdgFpOwSF35mqF3pYJfDQZUN6htnQExhItQnjZAbXYOtcQ0xwxqgyU8rnGqc8ft%2F5n%2FzgGKoC5jEnrQhfyI6AnPIxni1cFF0t1cjWMJ%2BUnm2b3WS0iaK112KajTfIVCGq4Mkr3m0qVdWDP5YhwDfm%2F7dirFkWXRVviT8c%2BiZGmCXT%2FczhSr6V4c%2FTk2ouhQ0N4k0PJhl5hCLqOUUYa6n8Mx&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20230829T024352Z&X-Amz-SignedHeaders=host&X-Amz-Expires=10800&X-Amz-Credential=ASIAUFSX5IYXWYXBKMNL%2F20230829%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Signature=89969edb574ca9ea9d6c6e53697e4545cf94334970244ce87f3d57a3c0d1da19';

      // Trigger download by creating a temporary anchor element
      const link = document.createElement('a');
      link.href = presignedUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.click();
    } catch (error) {
      console.log('Error downloading S3 object:', error);
    }
  };

  useEffect(() => {
    const countdownInterval = setInterval(() => {
      setRemainingTime(prevTime => prevTime - 1);
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, []);

  const formatTime = seconds => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    return `${hours.toString().padStart(2, '0')} : ${minutes
      .toString()
      .padStart(2, '0')} : ${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div>
      <p>Welcome Project</p>

      {/* S3 Button */}
      <button id="s3Button" onClick={handleS3ButtonClick}>
        S3 Button
      </button>

      {/* Countdown Timer */}
      <div>
        <h4>Countdown Timer:</h4>
        <p>
          {remainingTime > 0 ? formatTime(remainingTime) : 'Countdown expired'}
        </p>
      </div>
    </div>
  );
}

export default App;
