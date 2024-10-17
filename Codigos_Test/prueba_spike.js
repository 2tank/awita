import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '1s', target:  0},   
    { duration: '5s', target: 1000 },
    { duration: '1s', target: 0}    
  ],
};

export default function () {
  const url = 'https://librewolf.net/';
  
  const res = http.get(url);

  check(res, {
    'status was 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });

  sleep(1);
}
