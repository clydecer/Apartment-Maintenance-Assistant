import threading, unittest
from unittest.mock import patch
from http.server import ThreadingHTTPServer
from urllib.request import Request, urlopen
import json
import app
S='Water is leaking under my sink and spreading.'
def candidate():
 return dict(category='Plumbing',priority='High',category_reason='Leak under sink',priority_reason='Water spreading',category_excerpt='leaking under my sink',priority_excerpt='spreading',missing_information=['Is water flowing?'],follow_up_questions=['Can water be shut off safely?'],uncertainty_note='')
class ValidationTests(unittest.TestCase):
 def test_input(self):
  for x in ('','  ','x'*2001,None):
   with self.subTest(x=x), self.assertRaises(ValueError): app.validate_input(x)
  self.assertEqual(app.validate_input(' a '),'a')
 def test_risks(self):
  self.assertTrue(app.risk_flag('sparks at outlet')); self.assertTrue(app.risk_flag('I smell gas')); self.assertFalse(app.risk_flag('cabinet loose'))
 def test_candidate(self): self.assertEqual(app.validate_candidate(candidate(),S)['category'],'Plumbing')
 def test_invalid_candidate(self):
  for field,val in [('category','Other'),('priority','critical'),('category_excerpt','invented'),('priority_excerpt',''),('missing_information',['x']*6),('follow_up_questions',[None])]:
   with self.subTest(field=field):
    obj=candidate(); obj[field]=val
    with self.assertRaises(app.InvalidCandidate): app.validate_candidate(obj,S)
 @patch.dict('os.environ',{},clear=True)
 def test_missing_key(self):
  with self.assertRaisesRegex(RuntimeError,'not configured'): app.analyze(S)
class EndpointTests(unittest.TestCase):
 @classmethod
 def setUpClass(cls):
  cls.server=ThreadingHTTPServer(('127.0.0.1',0),app.Handler); cls.thread=threading.Thread(target=cls.server.serve_forever,daemon=True); cls.thread.start(); cls.url=f'http://127.0.0.1:{cls.server.server_port}/analyze'
 @classmethod
 def tearDownClass(cls): cls.server.shutdown(); cls.server.server_close(); cls.thread.join()
 def post(self,s):
  req=Request(self.url,data=json.dumps({'description':s}).encode(),headers={'Content-Type':'application/json'},method='POST')
  with urlopen(req) as r: return json.load(r)
 @patch('app.analyze',return_value=candidate())
 def test_success(self,_): self.assertEqual(self.post(S)['status'],'Needs review')
 @patch('app.analyze',side_effect=RuntimeError('unavailable'))
 def test_failure(self,_):
  result=self.post('sparks at outlet'); self.assertEqual(result['status'],'Analysis failed'); self.assertTrue(result['risk']); self.assertNotIn('candidate',result)
if __name__=='__main__': unittest.main()
