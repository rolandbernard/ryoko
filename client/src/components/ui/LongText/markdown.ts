
type TemplateValue = string | number | TemplateValue[];

/**
 * This is a simple helper function that will join the elements. This is to be used
 * as a custom string template literal tag. The custom template tag is mainly used
 * to get syntax highlighting in code editors.
 * 
 * @param str The strings of the template
 * @param values The values in the template
 * @returns The concatenated string
 */
function html(str: TemplateStringsArray, ...values: TemplateValue[]) {
    return str.map((s, i) => {
        const value = values[i];
        if (value instanceof Array) {
            return s + value.flat(Infinity).map(el => el.toString()).join('');
        } else {
            return s + (value?.toString() || '');
        }
    }).join('');
}

interface Footnote {
    id: number;
}

interface Link {
    link?: string;
    title?: string;
}

type LinkRegistry = Record<string, Footnote | Link>;

/**
 * Escape the given string to be displayable directly inside of a HTML document.
 * 
 * @param markdown The string to escape
 * @returns The escaped string
 */
function escapeHtml(markdown: string) {
    return markdown
        .replace(/"/g, html`&quot;`)
        .replace(/&/g, html`&amp;`)
        .replace(/'/g, html`&#39;`)
        .replace(/</g, html`&lt;`)
        .replace(/>/g, html`&gt;`);
}

/**
 * Compile inline constructs of markdown that can be contained inside of a paragraph.
 * 
 * @param markdown The source to compile
 * @param data The data of all footnotes and named links in the source
 * @returns The compiled output
 */
function compileInlineConstructs(markdown: string, data: LinkRegistry): string {
    let output = ''; 
    let offset = 0;
    let last_copy = 0;
    while (offset < markdown.length) {
        if (markdown[offset] === '\\') {
            output += markdown.substr(last_copy, offset - last_copy);
            offset++;
            output += markdown[offset];
            offset++;
            last_copy = offset;
        } else if (markdown.substr(offset, 2) === '![') {
            output += markdown.substr(last_copy, offset - last_copy);
            last_copy = offset;
            offset += 2;
            let depth = 0;
            const start = offset;
            while (offset < markdown.length && (markdown[offset] !== ']' || depth !== 0)) {
                if (markdown[offset] === '\\') {
                    offset++;
                } else if (markdown[offset] === '[') {
                    depth++;
                } else if (markdown[offset] === ']') {
                    depth--;
                }
                offset++;
            }
            const end = offset;
            offset++;
            while (markdown[offset] === ' ' || markdown[offset] === '\t') {
                offset++;
            }
            if (markdown[offset] === '(') {
                offset++;
                const link_start = offset;
                while (
                    offset < markdown.length
                    && markdown[offset] !== ')'
                    && markdown[offset] !== '='
                    && markdown[offset] !== '"'
                ) {
                    offset++;
                }
                const link_end = offset;
                let width;
                let height;
                if (markdown[offset] === '=') {
                    offset++;
                    const start_width = offset;
                    while (
                        (markdown[offset] >= '0' && markdown[offset] <= '9')
                        || markdown[offset] === ' ' || markdown[offset] === '\t'
                    ) {
                        offset++;
                    }
                    if (offset !== start_width) {
                        width = parseInt(markdown.substr(start_width, offset - start_width));
                    }
                    if (markdown[offset] === 'x') {
                        offset++;
                        const start_height = offset;
                        while (
                            (markdown[offset] >= '0' && markdown[offset] <= '9')
                            || markdown[offset] === ' ' || markdown[offset] === '\t'
                        ) {
                            offset++;
                        }
                        if (offset !== start_height) {
                            height = parseInt(markdown.substr(start_height, offset - start_height));
                        }
                    }
                }
                while (
                    offset < markdown.length
                    && markdown[offset] !== ')'
                    && markdown[offset] !== '"'
                ) {
                    offset++;
                }
                if (markdown[offset] === '"') {
                    offset++;
                    const title_start = offset;
                    while (offset < markdown.length && markdown[offset] !== ')' && markdown[offset] !== '"') {
                        offset++;
                    }
                    const title_end = offset;
                    if (markdown[offset] === '"') {
                        while (offset < markdown.length && markdown[offset] !== ')') {
                            offset++;
                        }
                    }
                    offset++;
                    output += html`<img
                        class="markdown md-image"
                        src="${markdown.substr(link_start, link_end - link_start).trim()}"
                        title="${markdown.substr(title_start, title_end - title_start)}"
                        alt="${markdown.substr(start, end - start)}"
                        ${width ? `width="${width}"` : ''}
                        ${height ? `height="${height}"` : ''}
                    />`;
                    last_copy = offset;
                } else {
                    offset++;
                    output += html`<img
                        class="markdown md-image"
                        src="${markdown.substr(link_start, link_end - link_start).trim()}"
                        alt="${markdown.substr(start, end - start)}"
                        ${width ? `width="${width}"` : ''}
                        ${height ? `height="${height}"` : ''}
                    />`;
                    last_copy = offset;
                }
            }
        } else if (markdown[offset] === '[') {
            output += markdown.substr(last_copy, offset - last_copy);
            last_copy = offset;
            offset++;
            let depth = 0;
            const start = offset;
            while (offset < markdown.length && (markdown[offset] !== ']' || depth !== 0)) {
                if (markdown[offset] === '\\') {
                    offset++;
                } else if (markdown[offset] === '[') {
                    depth++;
                } else if (markdown[offset] === ']') {
                    depth--;
                }
                offset++;
            }
            const end = offset;
            offset++;
            if (markdown[start] === '^') {
                const name = markdown.substr(start, end - start).toLowerCase();
                output += html`<a
                    class="markdown md-footnote-ref"
                    href="#fn:${name}"
                >${(data[name] as Footnote)?.id}</a>`;
                last_copy = offset;
            } else {
                while (markdown[offset] === ' ' || markdown[offset] === '\t') {
                    offset++;
                }
                if (markdown[offset] === '(') {
                    offset++;
                    const link_start = offset;
                    while (offset < markdown.length && markdown[offset] !== ')' && markdown[offset] !== '"') {
                        offset++;
                    }
                    const link_end = offset;
                    if (markdown[offset] === '"') {
                        offset++;
                        const title_start = offset;
                        while (offset < markdown.length && markdown[offset] !== ')' && markdown[offset] !== '"') {
                            offset++;
                        }
                        const title_end = offset;
                        if (markdown[offset] === '"') {
                            while (offset < markdown.length && markdown[offset] !== ')') {
                                offset++;
                            }
                        }
                        offset++;
                        output += html`<a
                            class="markdown md-link"
                            href="${markdown.substr(link_start, link_end - link_start).trim()}"
                            title="${markdown.substr(title_start, title_end - title_start)}"
                        >${compileInlineConstructs(markdown.substr(start, end - start), data)}</a>`;
                        last_copy = offset;
                    } else {
                        offset++;
                        output += html`<a
                            class="markdown md-link"
                            href="${markdown.substr(link_start, link_end - link_start).trim()}"
                        >${compileInlineConstructs(markdown.substr(start, end - start), data)}</a>`;
                        last_copy = offset;
                    }
                } else if (markdown[offset] === '[') {
                    offset++;
                    const name_start = offset;
                    while (offset < markdown.length && markdown[offset] !== ']') {
                        offset++;
                    }
                    const name_end = offset;
                    if (markdown[offset] === ']') {
                        offset++;
                        const name = markdown.substr(name_start, name_end - name_start).toLowerCase();
                        const link = data[name] as Link;
                        output += html`<a
                            class="markdown md-link"
                            ${link?.link ? `href="${link?.link}"` : ''}
                            ${link?.title ? `title="${link?.title}"` : ''}
                        >${compileInlineConstructs(markdown.substr(start, end - start), data)}</a>`;
                        last_copy = offset;
                    }
                }
            }
        } else if (markdown.substr(offset, 2) === '~~') {
            output += markdown.substr(last_copy, offset - last_copy);
            offset += 2;
            const start = offset;
            while (offset < markdown.length && markdown.substr(offset, 2) !== '~~') {
                if (markdown[offset] === '\\') {
                    offset++;
                }
                offset++;
            }
            output += html`<del class="markdown md-strike">${compileInlineConstructs(markdown.substr(start, offset - start), data)}</del>`;
            offset += 2;
            last_copy = offset;
        } else if (markdown[offset] === '*') {
            output += markdown.substr(last_copy, offset - last_copy);
            if (markdown[offset + 1] === '*') {
                offset += 2;
                let single = false;
                const start = offset;
                while (offset < markdown.length && (markdown.substr(offset, 2) !== '**' || single)) {
                    if (markdown[offset] === '\\') {
                        offset++;
                    } else if (markdown[offset] === '*') {
                        single = !single;
                    }
                    offset++;
                }
                output += html`<strong class="markdown md-bold">${compileInlineConstructs(markdown.substr(start, offset - start), data)}</strong>`;
                offset += 2;
            } else {
                offset++;
                const start = offset;
                while (offset < markdown.length && markdown[offset] !== '*') {
                    if (markdown[offset] === '\\') {
                        offset++;
                    }
                    offset++;
                }
                output += html`<em class="markdown md-italic">${compileInlineConstructs(markdown.substr(start, offset - start), data)}</em>`;
                offset++;
            }
            last_copy = offset;
        } else if (markdown[offset] === '_') {
            output += markdown.substr(last_copy, offset - last_copy);
            if (markdown[offset + 1] === '_') {
                offset += 2;
                let single = false;
                const start = offset;
                while (offset < markdown.length && (markdown.substr(offset, 2) !== '__' || single)) {
                    if (markdown[offset] === '\\') {
                        offset++;
                    } else if (markdown[offset] === '_') {
                        single = !single;
                    }
                    offset++;
                }
                output += html`<strong class="markdown md-bold">${compileInlineConstructs(markdown.substr(start, offset - start), data)}</strong>`;
                offset += 2;
            } else {
                offset++;
                const start = offset;
                while (offset < markdown.length && markdown[offset] !== '_') {
                    if (markdown[offset] === '\\') {
                        offset++;
                    }
                    offset++;
                }
                output += html`<em class="markdown md-italic">${compileInlineConstructs(markdown.substr(start, offset - start), data)}</em>`;
                offset++;
            }
            last_copy = offset;
        } else if (markdown[offset] === '`') {
            output += markdown.substr(last_copy, offset - last_copy);
            if (markdown[offset + 1] === '`') {
                offset += 2;
                const start = offset;
                while (offset < markdown.length && markdown.substr(offset, 2) !== '``') {
                    if (markdown[offset] === '\\') {
                        offset++;
                    }
                    offset++;
                }
                output += html`<code class="markdown md-inline-code">${escapeHtml(markdown.substr(start, offset - start))}</code>`;
                offset += 2;
            } else {
                offset++;
                const start = offset;
                while (offset < markdown.length && markdown[offset] !== '`') {
                    if (markdown[offset] === '\\') {
                        offset++;
                    }
                    offset++;
                }
                output += html`<code class="markdown md-inline-code">${escapeHtml(markdown.substr(start, offset - start))}</code>`;
                offset++;
            }
            last_copy = offset;
        } else {
            offset++;
        }
    }
    output += markdown.substr(last_copy, offset - last_copy);
    return output;
}

/**
 * Collect the given lines into a single paragraph, also compiling the inline constructs contained
 * in the given lines.
 * 
 * @param lines The lines to compile
 * @param paragraphs Where to add the paragraphs to
 * @param data The data of all footnotes and named links in the source
 */
function linesToParagraph(lines: string[], paragraphs: string[], data: LinkRegistry): void {
    if (lines.length !== 0  && lines.join(' ').trim().length !== 0) {
        paragraphs.push(html`<p class="markdown md-paragraph">${compileInlineConstructs(lines.join(' '), data)}</p>`);
    }
    lines.splice(0);
} 

/**
 * Compile all the mark source lines into a string of markdown paragraphs.
 * 
 * @param lines The lines to compile
 * @param data The data of all footnotes and named links in the source
 * @returns The compiled lines
 */
function compileLines(lines: string[], data: LinkRegistry): string[] {
    const lines_to_convert: string[] = [];
    const converted_paragraphs: string[] = [];
    while (lines.length !== 0) {
        const line_orig = lines.shift() ?? '';
        const line = line_orig.trim();
        if (line.length === 0) {
            linesToParagraph(lines_to_convert, converted_paragraphs, data);
        } else if (line_orig.startsWith('    ') || line_orig.startsWith('\t')) {
            linesToParagraph(lines_to_convert, converted_paragraphs, data);
            let code = line_orig.substr(line_orig.startsWith('    ') ? 4 : 1) + '\n';
            let tmp_code = '';
            while (lines.length !== 0) {
                const next_line = lines.shift() ?? '';
                const is_empty = next_line.trim().length === 0;
                if (next_line.startsWith('    ') || next_line.startsWith('\t')) {
                    code += tmp_code + next_line.substr(next_line.startsWith('    ') ? 4 : 1) + '\n';
                    tmp_code = '';
                } else {
                    if (!is_empty) {
                        lines.unshift(next_line);
                        break;
                    } else {
                        tmp_code += next_line + '\n';
                    }
                }
            }
            converted_paragraphs.push(html`<code class="markdown md-code"><pre class="markdown ">${escapeHtml(code)}</pre></code>`);
        } else if (line.startsWith('#')) {
            linesToParagraph(lines_to_convert, converted_paragraphs, data);
            let header_num = 1;
            while (line[header_num] === '#') {
                header_num++;
            }
            if (line.endsWith('}')) {
                const match = line.match(/\{#([^}]*)\}$/);
                const text = compileInlineConstructs(line.substr(header_num, line.length - header_num - (match?.[0].length ?? 0)).trim(), data);
                header_num = Math.min(header_num, 6);
                converted_paragraphs.push(`<h${header_num} id="${match?.[1]}" class="markdown md-header-${header_num}">${text}</h${header_num}>`);
            } else {
                const text = compileInlineConstructs(line.substr(header_num).trim(), data);
                header_num = Math.min(header_num, 6);
                converted_paragraphs.push(`<h${header_num} class="markdown md-header-${header_num}">${text}</h${header_num}>`);
            }
        } else if (line.startsWith('===') && !line.match(/[^=]/) && lines_to_convert.length !== 0) {
            converted_paragraphs.push(html`<h1 class="markdown md-header-1">${compileInlineConstructs(lines_to_convert.join(' '), data)}</h1>`);
            lines_to_convert.splice(0);
        } else if (line.startsWith('---') && !line.match(/[^-]/) && lines_to_convert.length !== 0) {
            converted_paragraphs.push(html`<h2 class="markdown md-header-2">${compileInlineConstructs(lines_to_convert.join(' '), data)}</h2>`);
            lines_to_convert.splice(0);
        } else if (
            (line.startsWith('---') && !line.match(/[^-]/))
            || (line.startsWith('***') && !line.match(/[^*]/))
            || (line.startsWith('___') && !line.match(/[^_]/))
        ) {
            linesToParagraph(lines_to_convert, converted_paragraphs, data);
            converted_paragraphs.push(html`<hr class="markdown md-hrule"/>`);
        } else if (line.match(/^\|?(([^`]|`.*?`)*\|)+([^`]|`.*?`)*\|?$/)) {
            linesToParagraph(lines_to_convert, converted_paragraphs, data);
            const table = [ line.split('|') ];
            while (lines.length !== 0 && lines[0].match(/^\|?(([^`]|`.*?`)*\|)+([^`]|`.*?`)*\|?$/)) {
                const next_line = lines.shift()?.trim() ?? '';
                table.push(next_line.split('|'));
            }
            let alignment: string[] | undefined;
            if (table[1]?.some(field => field.trim().match(/^:?\s*-{3,}\s*:?$/))) {
                alignment = table[1]
                    .map(field => field.trim())
                    .map(field => (
                        field.endsWith(':')
                            ? field.startsWith(':')
                                ? 'md-align-center'
                                : 'md-align-right'
                            : 'md-align-left'
                    ));
            }
            const length = table.reduce((a, row) => Math.max(a, row.length), 0);
            const has_first = table.some(row => row[0].trim());
            const has_last = table.some(row => row[length - 1]?.trim());
            converted_paragraphs.push(html`
                <table class="markdown md-table">${table.filter((_, i) => !alignment || i !== 1).map((row, i) => html`
                    <tr class="markdown md-table-row">${row
                        .filter((_, j) => (has_first || j !== 0) && (has_last || j !== length - 1))
                        .map((field, j) => (
                            (i === 0 && alignment)
                                ? html`<th class="markdown md-table-header ${alignment?.[j] || ''}">${compileInlineConstructs(field, data)}</th>`
                                : html`<td class="markdown md-table-data ${alignment?.[j] || ''}">${compileInlineConstructs(field, data)}</td>`
                        ))
                    }</tr>
                `)}</table>
            `);
        } else if (line.match(/^\s*([0-9]+[.)]|-\s?\[[Xx ]?\]|[+*-] )/)) {
            linesToParagraph(lines_to_convert, converted_paragraphs, data);
            const regex = /^\s*([0-9]+[.)]|[+*-] )/;
            const listTypeAndOrder = function (line: string): [ RegExp, number ] {
                const match = line.match(/^\s*([0-9]+[.)]|-\s?\[[Xx ]?\]|[+*-] )/);
                if (match?.[0].includes(')')) {
                    return [ /^\s*[0-9]+[)]/, 1 ];
                } else if (match?.[0].includes('.')) {
                    return [ /^\s*[0-9]+[.]/, 1 ];
                } else if (match?.[0].includes('[')) {
                    return [ /^\s*-\s?\[[Xx ]?\]/, 2 ];
                } else if (match?.[0].includes('*')) {
                    return [ /^\s*[*] /, 0 ];
                } else if (match?.[0].includes('+')) {
                    return [ /^\s*[+] /, 0 ];
                } else if (match?.[0].includes('-')) {
                    return [ /^\s*[-] /, 0 ];
                } else {
                    return [ / /, 0 ];
                }
            }
            const generateList = function (): string {
                if (ordered === 1) {
                    return html`<ol class="markdown md-ordered-list">${
                        items.map(item => html`<li>${compileLines(item, data)}</li>`)
                    }</ol>`;
                } else if (ordered === 0) {
                    return html`<ul class="markdown md-unordered-list">${
                        items.map(item => html`<li>${compileLines(item, data)}</li>`)
                    }</ul>`;
                } else if (ordered === 2) {
                    return html`<ul class="markdown md-todo-list">${
                        items.map(item => {
                            const match = item[0].match(/^\s?\[([Xx ]?)\]/);
                            const checked = match?.[1]?.toLowerCase() === 'x' ? 'checked' : '';
                            item[0] = item[0].replace(/^\s?\[([Xx ]?)\]/, '');
                            return [html`
                                <li>
                                    <input type="checkbox" name="_" disabled ${checked} /><span>${compileLines(item, data)}</span>
                                </li>`
                            ]
                        })
                    }</ul>`;
                } else {
                    return '';
                }
            }
            const nesting_stack : [ string[][], RegExp, number, number ][] = [ ];
            let [ listType, ordered ] = listTypeAndOrder(line);
            let items = [ [ line.replace(regex, '') ] ];
            let last_indent = 0;
            while (line_orig[last_indent] === ' ' || line_orig[last_indent] === '\t') {
                last_indent++;
            }
            let was_empty = false;
            while (lines.length !== 0) {
                const next_line = lines.shift() ?? '';
                const is_empty = next_line.trim().length === 0;
                if (next_line.match(regex)) {
                    let indent = 0;
                    while (next_line[indent] === ' ' || next_line[indent] === '\t') {
                        indent++;
                    }
                    if (indent > last_indent) {
                        nesting_stack.push([ items, listType, last_indent, ordered ]);
                        items = [];
                        [ listType, ordered ] = listTypeAndOrder(next_line);
                    } else if (indent < last_indent && nesting_stack.length !== 0) {
                        while (nesting_stack.length !== 0 && indent < last_indent) {
                            let sub_list = generateList() ?? '';
                            [ items, listType, last_indent, ordered ] = nesting_stack.pop() ?? [ [], / /, 0, 0 ];
                            items[items.length - 1].push(sub_list);
                        }
                    }
                    if (!next_line.match(listType)) {
                        if (nesting_stack.length !== 0) {
                            const sub_list = generateList() ?? '';
                            [ items, listType, last_indent, ordered ] = nesting_stack.pop() ?? [ [], / /, 0, 0 ];
                            items[items.length - 1].push(sub_list);
                            nesting_stack.push([ items, listType, last_indent, ordered ]);
                            items = [];
                        } else {
                            converted_paragraphs.push(generateList());
                            items = [];
                        }
                        [ listType, ordered ] = listTypeAndOrder(next_line);
                    }
                    items.push([ next_line.replace(regex, '') ]);
                    last_indent = indent;
                } else if (next_line.substr(last_indent).startsWith('    ') || next_line.substr(last_indent).startsWith('\t')) {
                    items[items.length - 1].push(next_line.substr(last_indent + (next_line.substr(last_indent).startsWith('    ') ? 4 : 1)));
                } else {
                    if (!is_empty && was_empty) {
                        lines.unshift(next_line);
                        break;
                    } else {
                        items[items.length - 1].push(next_line);
                    }
                }
                was_empty = is_empty;
            }
            while (nesting_stack.length !== 0) {
                let sub_list = generateList();
                [ items, listType, last_indent, ordered ] = nesting_stack.pop() ?? [ [], / /, 0, 0 ];
                items[items.length - 1].push(sub_list);
            }
            converted_paragraphs.push(generateList());
        } else if (line.startsWith('```') || line.startsWith('~~~')) {
            linesToParagraph(lines_to_convert, converted_paragraphs, data);
            let code = '';
            while (lines.length !== 0 && lines[0].trim() !== line.substr(0, 3)) {
                const next_line = lines.shift();
                code += next_line + '\n';
            }
            code = code.substr(0, code.length - 1); // Remove the trailing newline
            lines.shift();
            code = escapeHtml(code);
            converted_paragraphs.push(html`
                <code class="markdown md-code">
                    <span class="markdown md-lines">${code.split('\n').map((_, i) => html`<span class="markdown md-line">${i + 1}</span>`)}</span>
                    <span class="markdown md-code-content"><pre class="markdown ">${code}</pre></span>
                </code>
            `);
        } else if (line.startsWith('>')) {
            linesToParagraph(lines_to_convert, converted_paragraphs, data);
            let quote_lines = [ line.substr(1) ];
            while (lines.length !== 0 && lines[0].trim().length !== 0) {
                const next_line = lines.shift() ?? '';
                if (next_line.trim().startsWith('>')) {
                    quote_lines.push(next_line.trim().substr(1));
                } else {
                    quote_lines.push(next_line);
                }
            }
            converted_paragraphs.push(html`<div class="markdown md-quote">${compileLines(quote_lines, data)}</div>`)
        } else if (line.match(/^\[(.*)\]:/)) {
            linesToParagraph(lines_to_convert, converted_paragraphs, data);
            const items = [];
            let start = -1;
            let next_line = line;
            while (next_line?.match(/^\[(\^.*)\]:(.*)/)) {
                const match = next_line.trim().match(/^\[(.*)\]:(.*)/);
                let fn_lines = [ match?.[2] ?? '' ];
                while (lines.length !== 0) {
                    const next_line = lines.shift() ?? '';
                    const is_empty = next_line.trim().length === 0;
                    if (next_line.startsWith('    ') || next_line.startsWith('\t')) {
                        fn_lines.push(next_line.substr(next_line.startsWith('    ') ? 4 : 1));
                    } else {
                        if (!is_empty) {
                            lines.unshift(next_line);
                            break;
                        } else {
                            fn_lines.push(next_line);
                        }
                    }
                }
                const name = match?.[1].toLowerCase() ?? '';
                if (start < 0) {
                    start = (data[name] as Footnote)?.id;
                }
                items.push(html`<li id="fn:${name}">${compileLines(fn_lines, data)}</li>`);
                next_line = lines.shift() ?? '';
            }
            if (items.length > 0) {
                if (next_line) {
                    lines.unshift(next_line);
                }
                converted_paragraphs.push(html`
                    <ol class="markdown md-footnote" start="${start}">
                        ${items}
                    </ol>
                `);
            }
        } else if (line.startsWith('[') && line.endsWith(']')) {
            linesToParagraph(lines_to_convert, converted_paragraphs, data);
            let inline = false;
            if (line[1] === '^') {
                inline = true;
            }
            const to_wrap = converted_paragraphs.pop() ?? '';
            converted_paragraphs.push(html`
                <figure class="markdown md-info-wrap ${inline ? 'md-inline-info' : ''}">
                    ${to_wrap}
                    <figcaption class="markdown md-info">${compileInlineConstructs(line.substr(inline ? 2 : 1, line.length - (inline ? 3 : 2)), data)}</figcaption>
                </figure>
            `);
        } else {
            let actual_line = line;
            if (line.endsWith('\\')) {
                actual_line = line.substr(0, line.length - 1) + html`<br />`;
            } else if (line_orig.endsWith('  ')) {
                actual_line += html`<br />`;
            }
            lines_to_convert.push(actual_line);
        }
    }
    linesToParagraph(lines_to_convert, converted_paragraphs, data);
    return converted_paragraphs;
}

/**
 * Search for all footnotes and named links in the given lines of markdown code.
 * 
 * @param lines The lines to search
 * @returns The LinkRegistry created from the footnotes
 */
function getFootnoteRefs(lines: string[]) {
    const data: LinkRegistry = {};
    let footnote_id = 1;
    for (const line_orig of lines) {
        const line = line_orig.trim();
        const match = line.match(/^\[(.*)\]:(.*)/);
        if (match) {
            if (match[1].startsWith('^')) {
                data[match[1].toLowerCase()] = {
                    id: footnote_id,
                };
                footnote_id++;
            } else {
                const link = match[2].match(/([^('"]*)([('"](.*)[)'"])?/);
                data[match[1].toLowerCase()] = {
                    link: link?.[1].trim(),
                    title: link?.[3],
                };
            }
        }
    }
    return data;
}

/**
 * This function will compile the given markdown source to a string containing html.
 * This compiler supports all basic markdown features and some extended features. The following
 * features are supported:
 * - Headings
 * - Bold, italic and strikethrough
 * - Blockquotes
 * - Ordered and unordered lists
 * - Inline code
 * - Horizontal rule
 * - Links
 * - Images
 * - Tables
 * - Fenced code blocks
 * - Footnotes
 * - Heading ids
 * - Task list
 * 
 * @param markdown The markdown source
 * @returns The compilation output
 */
export function compileMarkdown(markdown: string): string {
    const lines = markdown.split('\n');
    const data = getFootnoteRefs(lines);
    return compileLines(lines, data).join('');
}

