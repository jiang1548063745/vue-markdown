// 注册过滤器
Vue.filter('date', time => moment(time).format('DD/MM/YY HH:mm'))

new Vue({
    el: '#notebook',
    data() {
        return {
            // 显示的笔记文本
            content: '',
            // 显示的笔记列表
            notes: JSON.parse(localStorage.getItem('notes')) || [],
            // 上次选中的笔记ID
            selectedId: localStorage.getItem('selected-id') || null
        }
    },
    // created() {
    //   // this.content = localStorage.getItem('content') || 'You can write in **markdown**'
    //   if (localStorage.getItem('content') != undefined)
    //     this.content = localStorage.getItem('content')
    //   this.content = 'You can write in **markdown**'
    // },
    computed: {
        // Markdown 渲染为 HTML
        notePreview() {
            return this.selectedNote ? marked(this.selectedNote.content) : ''
        },
        // 添加按钮数量提示
        addButtonTitle() {
            return this.notes.length + ' note(s) already'
        },
        // 返回与 selectId 匹配的笔记
        selectedNote() {
            return this.notes.find(note => note.id === this.selectedId) //=== undefined ? '' : this.notes.find(note => note.id === this.selectedId)
        },
        // 返回排序后笔记
        sortedNotes() {
            // 由于 sort 方法会直接修改源数组，这里使用 slice 方法创建新的副本。这样可以防止触发 notes 侦听器。
            return this.notes.slice()
                .sort((a, b) => a.created - b.created)
                .sort((a, b) => (a.favorite === b.favorite) ? 0 : a.favorite ? -1 : 1)
        },
        // 统计行数
        lineCount() {
            if (this.selectedNote) {
                return this.selectedNote.content.split(/\r\n|\r|\n/).length
            }
        },
        // 统计空格
        wordsCount() {
            if (this.selectedNote) {
                var s = this.selectedNote.content
                    // 将换行符转换为空格
                s = s.replace(/\n/g, ' ')
                    // 排除开头和结尾的空格
                s = s.replace(/(^\s*)|(\s*$)/gi, '')
                    // 将多个重复空格转换为一个
                s = s.replace(/\s\s+/gi, ' ')
                    // 返回空格数量
                return s.split(' ').length
            }
        },
        // 统计字数
        charactersCount() {
            if (this.selectedNote.content) {
                return this.selectedNote.content.split('').length
            }
        }
    },
    watch: {
        //侦听 笔记 的变化
        notes: {
            handler: 'saveNotes',
            // 需要使用这个选项来侦听数组中每个笔记属性的变化
            deep: true
        },
        // 保存选中项
        selectedId(val) {
            localStorage.setItem('selected-id', val)
        },
    },
    methods: {
        // 保存笔记
        // saveNote (val) {
        //   localStorage.setItem('content', JSON.stringify(this.content))
        // },
        saveNotes() {
            // 在存储之前不要忘记把对象转换为 JSON 字符串
            localStorage.setItem('notes', JSON.stringify(this.notes))
            console.log('Notes saved!', new Date())
        },
        reportOperation(opName) {
            console.log('The', opName, 'operation was completed!')
        },
        // 添加笔记
        addNote() {
            const time = Date.now()
            const note = {
                id: String(time),
                title: 'New note ' + (this.notes.length + 1),
                content: '**Hi!** This notebook is using [markdown](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet) for formatting!',
                created: time,
                favorite: false
            }
            this.notes.push(note)
        },
        // 选中笔记
        selectNote(note) {
            this.selectedId = note.id
        },
        //删除笔记
        removeNote() {
            if (this.selectedNote && confirm('Delete the note?')) {
                // 获取选中笔记在数组中的位置
                const index = this.notes.indexOf(this.selectedNote)
                if (index !== -1) {
                    this.notes.splice(index, 1)
                }
            }
        },
        //收藏
        favoriteNote() {
            // this.selectedNote.favorite = !this.selectedNote.favorite
            this.selectedNote.favorite ^= true
        },
    }
})