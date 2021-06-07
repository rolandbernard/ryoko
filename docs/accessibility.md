# Accessibility

## Introduction

This report aims to identify and solve accessibility problems with the project website. It will
start by listing all the problems that were identified and then explain how we were able to solve
them.

## Methodology

The accessibility issues were found primarily using the [WAVE](https://wave.webaim.org/) tool. We
also used the Lighthouse tool build into Google Chrome's
[DevTools](https://developer.chrome.com/docs/devtools/) to detect further issues and suggestions.
Some accessibility problems were also noticed by ourselves and not reported by the tools.

## Problems

### Colour contrast

The most common accessibility issues were that, according to WAVE, the contrast of the colour theme.
Since the users can change the colour theme of a project, some colours like yellow were considerably
more problematic than others.

### Selected vs. non-selected

Another related issue is the contrast between selected and non-selected filters in the task view.
The only change between selected and not selected was only a decreased opacity, which is not
directly obvious in some circumstances. Similarly, this problem also existed in the colour selection
for the projects.

### Redundant `alt`-texts

WAVE called attention to redundant alternative texts on avatar images of users. This was caused by
the fact that the nearby text was identical to the value of the `alt` attribute. In some areas, we
were also missing the `alt` text for images.

### Missing labels

Some input fields, e.g. search fields and comment fields, did not have any labels describing them.
They did, however, include a placeholder text that reasonably described their purpose.

### Heading-Tag order

One page of the application had a wrong order of heading tags. WAVE detected that we had a `h1` tag
and a `h4` tag but none of the tags in between, i.e. no `h1` and `h2`. This constitutes a problem
because it can be confusing to understand the site's structure without knowing the context.

### Too small texts

On some pages, we used relatively small and therefore hard to read text. Both WAVE and Lighthouse
alerted us of this problem.

### False warnings

WAVE also gave us some false warnings. For example, WAVE complains about the `noscript` element.
Since we are not using the `noscript` element for anything other than showing an error, this is not
a problem. Another thing WAVE highlight is a contrast error on the side navigation. This is not an
issue but caused by the fact that WAVE does not know that the text in the bar chart is displayed
outside the bar using CSS. Similarly, WAVE does not correctly understand linear gradients as
background for text.

## Solutions

### Colour contrast

To fix the errors concerning the contrast of text, the yellow colour theme was changed to a light
brown tone. Additionally, the other colour themes were also darkened, to increase the readability of
text and improve the user experience.

### Selected vs. not selected

To better show the difference between selected and non-selected items in the task status filter and
project colour selection, we supplemented the decreased opacity with a smaller size. We also lowered
the saturation of deselected items.

### Redundant `alt`-texts

To address the concerns with the `alt`-texts, we followed the recommendation of WAVE and changed the
alternative texts to an empty string. This signals that the `alt` attribute was intentionally
omitted. In other places where we missed the `alt`-text, we simply added an appropriate test.

### Missing labels

Even though we already have a placeholder text, we decided to add labels for the offending input
elements. This will increase the web site's accessibility to screen readers.

### Heading-Tag order

To solve the issue with the order of heading tags, we decided to remove the heading tag completely
and remove it with a `div` element and a custom CSS class. We did this since it did not represent a
heading at all and was mainly used for styling purposes.

### Too small texts

To fix the issues with the small text sizes, the design was changed to fit a larger text size. This
greatly improves the readability of the text, especially for users with visual impairment.

## Conclusions

In conclusion, we can say that we fixed most issues that we were alerted to by WAVE. Since the tool
only inspects the HTML and can not see the rendered results, however, some recommendations were not
correct.

