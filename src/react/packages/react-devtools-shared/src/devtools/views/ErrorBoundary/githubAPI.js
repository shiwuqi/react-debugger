/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *      
 */

                           
                
              
  

const GITHUB_ISSUES_API = 'https://api.github.com/search/issues';

export function searchGitHubIssuesURL(message        )         {
  // Remove Fiber IDs from error message (as those will be unique).
  message = message.replace(/"[0-9]+"/g, '');

  const filters = [
    'in:title',
    'is:issue',
    'is:open',
    'is:public',
    'label:"Component: Developer Tools"',
    'repo:facebook/react',
  ];

  return (
    GITHUB_ISSUES_API +
    '?q=' +
    encodeURIComponent(message) +
    '%20' +
    filters.map(encodeURIComponent).join('%20')
  );
}

export async function searchGitHubIssues(
  message        ,
)                              {
  const response = await fetch(searchGitHubIssuesURL(message));
  const data = await response.json();
  if (data.items.length > 0) {
    const item = data.items[0];
    return {
      title: item.title,
      url: item.html_url,
    };
  } else {
    return null;
  }
}
