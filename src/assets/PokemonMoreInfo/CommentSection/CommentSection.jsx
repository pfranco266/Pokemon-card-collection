import React, {useEffect, useState} from "react";
import { CommentSectionContainer, CommentForm, CommentLabel, CommentTextField, CommentSubmitButton } from "./CommentSection.styled";
import { v4 as uuid } from 'uuid';
import Comments from "./Comments"


function CommentSection ({id}) {

    const [comments, setComments] = useState([]);
    const [textField, setTextField] = useState('')

    async function fetchComments(id) {
        try {
            const res = await fetch(`http://localhost:3000/collection/${id}`);
            const data = await res.json();
            setComments(data)

            console.log(data)
            console.log('comments', comments)

        } catch (error) {
            console.error('Fetch error:', error); // Log the error for debugging
        }
    }


    useEffect(() => {
        fetchComments(id);
    }, [id])

  


    async function handleSubmit(e) {
        e.preventDefault();
        const commentData = {
            id: uuid(),
            content: e.target.elements.comment.value,
            pokemonId: id, 
            author: 'some dude'
        }
        console.log("DATRAAA", commentData)
        try {
        
            const res = await fetch(`http://localhost:3000/collection/${id}`, {
                    method: 'POST', 
                    headers: {
                        'Content-Type': 'application/json',
                      },
                    body: JSON.stringify(commentData),
                })
                

  

            if(!res.ok) {
                throw new Error('error posting comment')
            }
            fetchComments(id);

        

            setTextField('')
            // setComments(prev => )


        } catch (error) {
            console.log(error.message)
        }
    }

    function handleChange (e) {
        setTextField(e.target.value)
    }


        // console.log(typeof comments)
    return (
        <CommentSectionContainer>
            <CommentForm onSubmit={handleSubmit} >
                <CommentLabel htmlFor="Comments">Add a Comment:</CommentLabel>
                <CommentTextField name="comment" value={textField} onChange={handleChange} />
                <CommentSubmitButton type="submit">Submit Comment</CommentSubmitButton>
            </CommentForm>
            <Comments comments={comments}/>
        </CommentSectionContainer>
    )
}

export default CommentSection