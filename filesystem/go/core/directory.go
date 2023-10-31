package core

type Directory struct {
	AbstractFsObject *AbstractFsObject
	Children         []*AbstractFsObject
}

func NewDirectory(name string, parent *Directory) *Directory {
	var a *AbstractFsObject
	if parent == nil {
		a = &AbstractFsObject{Name: name, Parent: nil, Type: DIRECTORY}
	} else {
		a = &AbstractFsObject{Name: name, Parent: parent.AbstractFsObject, Type: DIRECTORY}
	}

	r := &Directory{a, []*AbstractFsObject{}}
	return r
}

func DirectoryFromAbstractFsObject(origin *AbstractFsObject) *Directory {
	return &Directory{AbstractFsObject: origin, Children: []*AbstractFsObject{}}
}

func (d *Directory) GetAbstractFsObject() *AbstractFsObject {
	return d.AbstractFsObject
}

func (d *Directory) GetChildren() []*AbstractFsObject {
	return d.Children
}

func (d *Directory) AddChild(child *AbstractFsObject) {
	d.Children = append(d.Children, child)
}

func (d *Directory) GetChildDirectory(name string) *Directory {
	for _, child := range d.Children {
		if child.GetName() == name && child.GetType() == DIRECTORY {
			return DirectoryFromAbstractFsObject(child)
		}
	}
	return nil
}

func (d *Directory) GetName() string {
	return d.AbstractFsObject.GetName()
}

func (d *Directory) GetParent() (FsObject, error) {
	return d.AbstractFsObject.GetParent()
}

func (d *Directory) GetType() FsObjectType {
	return DIRECTORY
}
