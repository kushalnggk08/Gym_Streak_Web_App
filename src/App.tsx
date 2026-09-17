/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { useGymStreak } from './hooks/useGymStreak';
import { Screen } from './types';
import { Layout } from './components/Layout';
import { HomeScreen } from './screens/HomeScreen';
import { ThirtyDaysScreen } from './screens/ThirtyDaysScreen';
import { ProgressScreen } from './screens/ProgressScreen';
import { SettingsScreen } from './screens/SettingsScreen';

export default function App() {
  const { data, updateRecord, resetData } = useGymStreak();
  const [currentScreen, setCurrentScreen] = useState<Screen>("home");

  if (!data) return null; // loading state essentially

  return (
    <Layout currentScreen={currentScreen} setScreen={setCurrentScreen}>
      {currentScreen === "home" && <HomeScreen data={data} updateRecord={updateRecord} />}
      {currentScreen === "30days" && <ThirtyDaysScreen data={data} />}
      {currentScreen === "progress" && <ProgressScreen data={data} />}
      {currentScreen === "settings" && <SettingsScreen resetData={resetData} setScreen={setCurrentScreen} />}
    </Layout>
  );
}
