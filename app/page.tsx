"use client";

import { useState, useEffect } from "react";
import { foodDatabase, mealPattern } from "./data";

// 타입 정의 추가
type FoodItem = {
  name: string;
  amount: string;
};

type Meal = {
  grains: FoodItem[];
  proteins: FoodItem[];
  vegetables: FoodItem[];
  fats: FoodItem[];
};

export default function Home() {
  // --- 1. 사용자 입력 상태 (나이, 키, 체중, 성별, 활동량) ---
  const [userInfo, setUserInfo] = useState({
    age: "",
    height: "",
    weight: "",
    gender: "male", // 'male' or 'female'
    activity: "1.2", // 활동 계수 (기본값: 좌식 생활)
  });
  
  const [calories, setCalories] = useState<number | null>(null); // 타입 명시

  // --- 2. 기존 상태 (식단, 광고) ---
  const [meal, setMeal] = useState<Meal | null>(null); // 타입 명시
  const [isAdOpen, setIsAdOpen] = useState(false);
  const [adTimer, setAdTimer] = useState(5);

  // --- 3. 입력값 변경 핸들러 ---
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  // --- 4. 칼로리 계산 함수 (Mifflin-St Jeor 공식) ---
  const calculateCalories = () => {
    const { age, height, weight, gender, activity } = userInfo;
    if (!age || !height || !weight) {
      alert("나이, 키, 체중을 모두 입력해주세요.");
      return;
    }

    let bmr = (10 * Number(weight)) + (6.25 * Number(height)) - (5 * Number(age));
    bmr += gender === "male" ? 5 : -161;

    const tdee = Math.round(bmr * Number(activity));
    setCalories(tdee);
  };

  // --- 5. 광고 및 식단 생성 로직 (기존 유지) ---
  const startProcess = () => {
    if (!calories) calculateCalories(); 
    
    setMeal(null);
    setAdTimer(0);
    setIsAdOpen(true);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isAdOpen && adTimer > 0) {
      interval = setInterval(() => setAdTimer((prev) => prev - 1), 1000);
    } else if (adTimer === 0 && isAdOpen) {
      setIsAdOpen(false);
      generateMeal();
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isAdOpen, adTimer]);

  const generateMeal = () => {
    const pickRandom = (category: keyof typeof foodDatabase, count: number): FoodItem[] => {
      const items: FoodItem[] = [];
      const sourceArray = [...foodDatabase[category]];
      for (let i = 0; i < count; i++) {
        if (sourceArray.length === 0) break;
        const randomIndex = Math.floor(Math.random() * sourceArray.length);
        items.push(sourceArray[randomIndex]);
      }
      return items;
    };

    const newMeal: Meal = {
      grains: pickRandom("grains", mealPattern.grains),
      proteins: pickRandom("proteins", mealPattern.proteins),
      vegetables: pickRandom("vegetables", mealPattern.vegetables),
      fats: pickRandom("fats", mealPattern.fats),
    };
    setMeal(newMeal);
  };

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4 relative">
      <h1 className="text-3xl font-bold text-green-700 mb-6">
        🥗 당뇨 맞춤 식단 생성기
      </h1>

      {/* --- 사용자 정보 입력 폼 --- */}
      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
          1. 내 정보 입력
        </h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">나이 (세)</label>
            <input
              type="number" name="age"
              value={userInfo.age} onChange={handleInputChange}
              className="w-full border rounded p-2 text-gray-800 focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="예: 45"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">성별</label>
            <select
              name="gender"
              value={userInfo.gender} onChange={handleInputChange}
              className="w-full border rounded p-2 text-gray-800 outline-none"
            >
              <option value="male">남성</option>
              <option value="female">여성</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">키 (cm)</label>
            <input
              type="number" name="height"
              value={userInfo.height} onChange={handleInputChange}
              className="w-full border rounded p-2 text-gray-800 outline-none"
              placeholder="예: 170"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">체중 (kg)</label>
            <input
              type="number" name="weight"
              value={userInfo.weight} onChange={handleInputChange}
              className="w-full border rounded p-2 text-gray-800 outline-none"
              placeholder="예: 70"
            />
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm text-gray-600 mb-1">활동량</label>
          <select
            name="activity"
            value={userInfo.activity} onChange={handleInputChange}
            className="w-full border rounded p-2 text-gray-800 outline-none"
          >
            <option value="1.2">거의 없음 (숨쉬기 운동만)</option>
            <option value="1.375">가벼운 활동 (주 1~3회 운동)</option>
            <option value="1.55">보통 활동 (주 3~5회 운동)</option>
            <option value="1.725">많은 활동 (주 6~7회 격한 운동)</option>
          </select>
        </div>

        <button
          onClick={calculateCalories}
          className="w-full bg-gray-800 hover:bg-gray-900 text-white py-2 rounded-lg transition-colors"
        >
          필요 칼로리 계산하기
        </button>

        {/* 계산 결과 표시 영역 */}
        {calories && (
          <div className="mt-4 p-4 bg-green-50 rounded-lg text-center animate-pulse">
            <p className="text-gray-600 text-sm">고객님의 하루 권장 섭취량은</p>
            <p className="text-3xl font-bold text-green-700 my-1">
              {calories.toLocaleString()} kcal
            </p>
            <p className="text-xs text-gray-500">
              (체중 유지를 위한 칼로리입니다. 감량을 원하시면 -300kcal 하세요.)
            </p>
          </div>
        )}
      </div>

      {/* --- 식단 생성 버튼 --- */}
      <div className="text-center mb-10">
         <h2 className="text-lg font-semibold text-gray-800 mb-4">
          2. 식단 추천 받기
        </h2>
        <button
          onClick={startProcess}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-10 rounded-full shadow-lg transition-transform transform hover:scale-105 active:scale-95"
        >
          {isAdOpen ? "생성 중..." : "랜덤 식단 뽑기 🎲"}
        </button>
      </div>

      {/* --- 광고 모달 --- */}
      {isAdOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col items-center justify-center p-4">
          <div className="bg-white w-full max-w-md p-6 rounded-lg text-center">
            <h3 className="text-lg font-bold mb-4 text-gray-800">
              잠시 후 식단이 생성됩니다...
            </h3>
            <div className="w-full h-48 bg-gray-200 flex items-center justify-center mb-4 rounded border border-gray-300">
              <p className="text-gray-500 font-medium">(이곳에 광고가 표시됩니다)</p>
            </div>
            <div className="text-2xl font-bold text-green-600">{adTimer}초</div>
          </div>
        </div>
      )}

      {/* --- 식단 결과 --- */}
      {meal && !isAdOpen && (
        <div className="w-full max-w-md bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 animate-fade-in-up mb-20">
          <div className="bg-green-100 p-4 border-b border-green-200">
            <h2 className="text-xl font-semibold text-green-800 text-center">
              추천 식단 구성
            </h2>
            {calories && (
              <p className="text-center text-sm text-green-600 mt-1">
                목표: {Math.round(calories / 3)} kcal (한 끼 기준)
              </p>
            )}
          </div>
          
          <div className="p-6 space-y-6">
            <Section title="🍚 곡류군" items={meal.grains} color="text-orange-600" />
            <Section title="🥩 어육류군" items={meal.proteins} color="text-red-600" />
            <Section title="🥦 채소군" items={meal.vegetables} color="text-green-600" />
            <Section title="🥑 지방군" items={meal.fats} color="text-yellow-600" />
          </div>
        </div>
      )}
    </main>
  );
}

// Section 컴포넌트에 타입 명시
function Section({
  title,
  items,
  color,
}: {
  title: string;
  items: FoodItem[];
  color: string;
}) {
  return (
    <div>
      <h3 className={`font-bold ${color} mb-2 flex items-center`}>
        {title}
        <span className="ml-2 text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded">
          {items.length} 단위
        </span>
      </h3>
      <ul className="list-disc list-inside space-y-1 bg-gray-50 p-3 rounded-lg">
        {items.map((item, idx) => (
          <li key={idx} className="text-gray-700">
            <span className="font-medium">{item.name}</span> 
            <span className="text-gray-400 text-sm ml-2">({item.amount})</span>
          </li>
        ))}
      </ul>
    </div>
  );
}