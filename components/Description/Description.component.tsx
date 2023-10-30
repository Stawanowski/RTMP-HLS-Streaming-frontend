"use client"
import React, { cloneElement, useEffect } from 'react'
import Banner from '../Banner/Banner.component';
import Link from 'next/link';
import JsxParser from 'react-jsx-parser'
import parse, { DOMNode } from 'html-react-parser';
import Social from '../Social/Social.component';



const Description = ({description}:{description:string}) => {
    const splitHtmlByComponents = (htmlString:any) => {
        const customComponentRegex = /\[.*?\/\]/g; 
        const splitContent = htmlString.split(customComponentRegex);
      
        const matches:any = Array.from(htmlString.matchAll(customComponentRegex));
      
        const result = [];
        for (let i = 0; i < splitContent.length; i++) {
          result.push(splitContent[i]);
          if (i < matches.length) {
            result.push(matches[i][0]);
          }
        }
      
        return result;
      };
      
      function extractBannerProps(str:string) {
        const regex = /src="([^"]+)" link="([^"]+)"/;
        const match = str.match(regex);
      
        if (match) {
          const [, src, link] = match;
          return { src, link };
        } else {
          return { src:undefined, link:undefined }; 
        }
      }
      function extractSocialProps(str:string) {
        const regex = /type="([^"]+)" link="([^"]+)"/;
        const match = str.match(regex);
      
        if (match) {
          const [, type, link] = match;
          return { type, link };
        } else {
          return { type:undefined, link:undefined }; 
        }
      }

      const splitContentArray = (unParsedArray:Array<string>) => {
        let result:string = ""
        for(let i =0; i<unParsedArray.length; i++){
          if(unParsedArray[i].startsWith('[Banner') || unParsedArray[i].startsWith('[Social')){
            result += DisplayComponent(unParsedArray[i])
          }else{
            let temp = splitHTMLTagsAndContent(unParsedArray[i])
            for(let i =0; i<temp.length; i++){
              result += temp[i]
            }
          }
        }
        return result
      }

      const splitHTMLTagsAndContent = (htmlString:string) => {
        const result = [];
        const tagPattern = /<[^>]+>/g;
      
        let match;
        let lastIndex = 0;
      
        while ((match = tagPattern.exec(htmlString)) !== null) {
          const tagStartIndex = match.index;
          const tagEndIndex = tagPattern.lastIndex;
          if (tagStartIndex > lastIndex) {
            const textContent = htmlString.substring(lastIndex, tagStartIndex);
            result.push(textContent);
          }
      
          const tag = htmlString.substring(tagStartIndex, tagEndIndex);
          result.push(tag);
      
          lastIndex = tagEndIndex;
        }
      
        if (lastIndex < htmlString.length) {
          const remainingContent = htmlString.substring(lastIndex);
          result.push(remainingContent);
        }
        return result;
      };
      
      const DisplayComponent = (component:string) => {
        if(component.startsWith('[Banner')){
          let {src, link}:{src:any, link:any} = extractBannerProps(component)
          if(src && link){
          return `<p class="banner" src="${src}" link="${link}"><p>`
          }
        }else if(component.startsWith('[Social')){
          let {type, link}:{type:any, link:any} = extractSocialProps(component)
          if(type && link){
            return `<p class="social" type="${type}" link="${link}"></h1>`
          }
        }
      }
      const jsxString = description;
      const contentArray = splitHtmlByComponents(jsxString);
      const finalArray = splitContentArray(contentArray)
      // useEffect(()=>{
      //   console.log(contentArray, splitContentArray(contentArray))
      // }, [])
 
      const options = {
        replace: ({ attribs }:any) => {
          if (!attribs) {
            return;
          }
          if (attribs.class === 'banner') {
            const { src, link } = attribs;
            return (
              <div style={{position:'relative'}} className='bannerContainer'>
                <Banner src={src} link={link} />
              </div>
            );
          }
          if (attribs.class === 'social') {
            const { type, link } = attribs;
            return (
              <Social type={type} link={link} />
            );
          }
        }
      };

  return (
    <div>
      {contentArray && (
        <>
        {parse(finalArray, options
        )
        }
        </>
        )}
    </div>
  )
}

export default Description