// 이 파일의 위치: netlify/functions/analyze.js

exports.handler = async (event, context) => {
    try {
        // 1. 클라이언트로부터 데이터 수신
        // allText: "의학입문 자유주제탐구 대학글쓰기 1 ..."
        // checklist: { volunteer: true, cpr: false, ... }
        const { text: allText, checklist: checklistData } = JSON.parse(event.body);

        // 2. 분석을 위한 기준 데이터 정의
        const allRequiredCourses = [
            '의예과신입생세미나',
            '의학입문',
            '자유주제탐구',
            '의학연구의 이해',
            '기초의학통계학 및 실험'
        ];
        
        // 3. 최종 분석 결과를 담을 객체
        const analysisResult = {};

        // ======================================================
        // 4. [요청하신 기능] "전공 필수" 분석
        // ======================================================
        const completedRequired = [];
        const remainingRequired = [];

        allRequiredCourses.forEach(course => {
            // allText 문자열에 해당 과목명이 포함되어 있는지 확인
            if (allText.includes(course)) {
                completedRequired.push(course);
            } else {
                remainingRequired.push(course);
            }
        });

        analysisResult["전공 필수"] = {
            description: "총 5개의 전공 필수 과목을 모두 이수해야 합니다.",
            displayType: "list_all", // script.js의 displayResults가 이 값을 보고 분기
            completed: completedRequired,
            remaining: remainingRequired
        };

        // ======================================================
        // 5. [TODO] 나머지 항목 분석 (우선 빈 값으로 채움)
        // ======================================================
        // (추후 여기에 '전공 선택', '필수 교양' 등 나머지 분석 로직을 추가해야 합니다.)
        
        analysisResult["전공 선택"] = {
            description: "12학점 이상 이수해야 합니다. (이 기능은 현재 개발 중)",
            displayType: "count",
            completed: [], // TODO: allText에서 전공 선택 과목 추출
            requiredCount: 4 // (예시: 3학점짜리 4개)
        };
        
        analysisResult["필수 교양"] = {
            description: "필수 교양 과목을 모두 이수해야 합니다. (이 기능은 현재 개발 중)",
            displayType: "list_remaining_custom",
            completed: [], // TODO: allText에서 필수 교양 과목 추출
            remaining: ["(개발 중)"] 
        };

        analysisResult["학문의 세계"] = {
            description: "5개 영역 중 4개 영역 이상, 12학점 이상 이수 (이 기능은 현재 개발 중)",
            displayType: "group_count",
            completed: [], // TODO
            remaining: [], // TODO
            completedCount: 0,
            requiredCount: 4
        };
        
        analysisResult["예체능"] = {
             description: "3학점 이상 이수 (이 기능은 현재 개발 중)",
            displayType: "count",
            completed: [], // TODO
            requiredCount: 2 // (예시: 1.5학점짜리 2개)
        };

        analysisResult["비교과"] = {
            description: "필수 요건 4개 모두, 선택 요건 4개 중 2개 이상 이수",
            displayType: "checklist",
            data: checklistData // 클라이언트에서 받은 값 그대로 전달
        };


        // 6. 분석 결과 반환
        return {
            statusCode: 200,
            body: JSON.stringify(analysisResult)
        };

    } catch (error) {
        // 오류 발생 시
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};
