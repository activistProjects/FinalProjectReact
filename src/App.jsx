import React, {useEffect, useState} from 'react';
import {formatStudentData} from './utils'
import Tags from './Tags';
import PlusButton from './PlusButton';
import TagInput from './TagInput';
import './App.css';

const URL = "https://api.hatchways.io/assessment/students";

function App() {

  const [studentData, setStudentData] = useState([]); 
  const [filteredStudentData, setFilteredStudentData] = useState([]);
  const [nameFilterInput, setNameFilterInput] = useState("");
  const [tagFilterInput, setTagFilterInput] = useState("");
 
  
  let filteredContent = [];
  let filteredContentTag = [];

  
  const getStudents = (URL) => {
     fetch(URL)
      .then(response => response.json())
      .then(data => formatStudentData(data.students))
      .then(formatted => setStudentData(formatted))
      .then(formatt => setFilteredStudentData(studentData))
      .catch(error => alert('Something went wrong!'));
  }

  
  const deleteTag = (tag, student) => {
        const res = [...filteredStudentData];
        res.forEach((stu) => {
           if (stu.id === student.id) {
              const filteredTags = stu.tags.filter(
                 (t) => t.toLowerCase() !== tag.toLowerCase()
              );
              stu.tags = filteredTags;
              return stu.tags; // exit loop; only will match one student
           }
           
        });
        setFilteredStudentData(res);
  }
  
  
  const addTag = (str, student) =>{
      // add tags to student
      if (!student.tags.length) {
         student.tags.push(str);
      } else if (!student.tags.includes(str)) {
         student.tags.push(str);
      } else {
        return; // no duplicates
      }
      
      // find student in studentData and replace with updated student (with tags)
      const index = studentData.findIndex((stu) => stu.id === student.id);
      const newStudentData = [...studentData];
      newStudentData[index] = student;
      setStudentData(newStudentData);
  };
  
  
  const filterContent = (nameInput) => {

      if (nameFilterInput !== "" && tagFilterInput !== ""){
         
         if (nameInput.length) {
            studentData.forEach(student => {
              if (student.fullName.toLowerCase().includes(nameInput.toLowerCase())) {
                filteredContent.push(student);
              }
            });
         }
  
         filteredContent = filteredContent.concat(filteredContentTag); 

        if (nameInput.length === 0) {
          setFilteredStudentData(studentData);
          return; 
        }
      
       setFilteredStudentData(filteredContent);
      
      } // filterContent's first if

      else {
         if (nameInput.length) {
            studentData.forEach(student => {
              if (student.fullName.toLowerCase().includes(nameInput.toLowerCase())) {
                filteredContent.push(student);
              }
            });
        }
  
        if (nameInput.length === 0) {
          setFilteredStudentData(studentData);
          return; 
        }
      
       setFilteredStudentData(filteredContent);
      
      } // filterContent's only else
  } // filterContent's end

  
  
  
  const filterContentTag = (tagInput) => {
   let newFilteredContent = [];
   let deepFilteredContent = [];
 
   if (nameFilterInput !== "" && tagFilterInput !== "") {
      
      filteredContent.forEach(stud => {
         if (stud.tags.lenght() !== 0) {
            newFilteredContent.push(stud);
         }
      });// filteredContent.forEach end
      
      if (tagInput.length) {
         newFilteredContent.forEach(student => {
               student.tags.forEach(tag => {
                  if (tag.toLowerCase().includes(tagInput.toLowerCase()))
                  {
                     deepFilteredContent.push(student);
                  }
               });// Inner forEach
         }); // Outter forEach
      }// First inner if from fisrt if

      setFilteredStudentData(deepFilteredContent);
   } // filterContentTag's First if

   if (tagInput.length) {
      
         studentData.map(student => {
               return student.tags.forEach(tag => {
                  if (tag.toLowerCase().includes(tagInput.toLowerCase()))
                  {
                     if (filteredContentTag.includes(student))
                     {
                        return filteredContentTag;
                     }
                     
                     else
                     {
                           filteredContentTag.push(student);
                     }
                  }
               });
         });
         
         setFilteredStudentData(filteredContentTag);
      }
   
   if (tagInput.length === 0) {
      setFilteredStudentData(studentData);
      return; 
   }
 } // filterContentTag end

  

   const handleNameFilterInput = (e) => {
      setNameFilterInput(e.target.value);
      filterContent(e.target.value); 
   }



   const handleTagFilterInput = (e) => {
      setTagFilterInput(e.target.value);
      filterContentTag(e.target.value); 
   }
  


   useEffect(() => {
      getStudents(URL);
   }, []); 
  
  return (
     <>
     <header>
     <input
           className='inputs'
           placeholder={`Search by name`}
           value={nameFilterInput}
           onChange={e => handleNameFilterInput(e)}
         />
      <input
           className='inputs'
           placeholder={`Search by tag`}
           value={tagFilterInput}
           onChange={e => handleTagFilterInput(e)}
         />
     </header>
    <main>
    <ul>
     {
       filteredStudentData && 
        filteredStudentData.map((student, index) => {
          return (
            <article key = {index} id= "info">
               <img 
                  id='pic'
                  src = {student.pic} 
                  alt = {student.fullName}
                  loading="lazy"
               />
               <h1 id='name'>{student.fullName}</h1>
               <div id='infoStud'>
                  
                  <div>
                     <div>Email: {student.email}</div>
                     <div>Company: {student.company}</div>
                     <div>Skill: {student.skill}</div>
                     <div>Average: {student.average}%</div>
                  </div>
                  <Tags student = {student} deleteTag = {deleteTag} />
                  <TagInput student = {student} addTag = {addTag} />
                  {/*<Grades />*/}
               </div>
               <PlusButton student = {student}/>
               
               
            </article>
          )
        })
     }
     </ul>
    </main>
     </>
  );
}

export default App;
